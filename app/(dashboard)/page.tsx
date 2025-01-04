"use server"
import { ErrorCard } from "@/components/cards/cards"
import Chart from "@/components/charts/primitive/chart"
import ChartIcon from "@/components/charts/primitive/chart_icon"
import ChartContainer from "@/components/charts/primitive/container"

import AreaChart from "@/components/charts/area"
import PositionList from "@/components/displays/position_list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchRpc } from "@/database/fetch_rpc"
import { getUser } from "@/database/get_user_server"
import { restructure } from "@/database/restructure_depot_position_data"
import { to_display_string } from "@/lib/cash_display_string"
import { calculateOffset } from "@/lib/data/data_utils"
import {
	getCurrentDate,
	getDateCertainDaysAgo,
	toISODateOnly,
} from "@/lib/date_utils"
import { LineChart as LinechartIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { cache } from "react"
import { relativeChange } from "@/lib/data/change"
import get_sign from "@/lib/data/get_sign"
import { WinLossIndicator } from "@/components/stat/indicator"
import WinLossDisplay from "@/components/stat/simple_stat"
import type { DepotValue } from "@/database/custom_types"
import HeaderStat from "@/components/stat/header_stat"
// export const revalidate = 3600
export default async function Page() {
	const { positions, depotValues, error } = await dataFetcher()
	if (error) {
		return <ErrorCard error={error} />
	}

	

	const areaData = []

	for (const value of depotValues) {
		areaData.push({
			totalAssets: value.stock_assets + value.liquid_assets,
			timestamp: value.timestamp,
		})
	}

	const { startValue, offset } = calculateOffset(areaData, "totalAssets")

	const {today, start} = calculateProfits(depotValues)

	return (
		<main className="grid grid-cols-1 gap-3">
			<Card className="overflow-hidden">
				<CardHeader>
				<CardTitle>
					<HeaderStat displays={{
						"Depotwert": today.value,
						"Heutiger Profit": today.profit,
						"Gesamter Profit": start.profit,
					}}/>
					</CardTitle>
				</CardHeader>
				<CardContent className="m-0 px-0 pb-0">
					<ChartContainer className="*:px-6" defaultName="line">
						<Chart name="line">
							<AreaChart
								className="aspect-[4/3] md:aspect-[20/9] lg:aspect-[6/2] xl:aspect-[8/2]"
								startValue={startValue}
								offset={offset}
								data={areaData}
								dataKey="totalAssets"
								xKey="timestamp"
								yKey="totalAssets"
							/>
						</Chart>
						<ChartIcon name="line">
							<LinechartIcon className="size-7 md:size-5 stroke-muted-foreground" />
						</ChartIcon>
					</ChartContainer>
				</CardContent>
			</Card>
			<PositionList positions={restructure(positions)} />
		</main>
	)
}

const dataFetcher = cache(async () => {
	const user = await getUser()

	if (!user) {
		redirect("/auth/login")
	}

	const depotResponse = await fetchRpc("get_depots_of_user", {
		user_id: user.id,
	})

	if (depotResponse.error) {
		return {
			depots: null,
			error: depotResponse.error,
			positions: null,
			depotValues: null,
		}
	}
	if (depotResponse.count === 0) {
		return {
			depots: null,
			error: new Error(`no depots present for user ${user.id}`),
			positions: null,
			depotValues: null,
		}
	}

	const depots = depotResponse.data

	const positionRequest = fetchRpc("get_depot_positions", {
		depot_id_param: depots[0].id,
		price_count_param: 2,
	})

	const endDate = toISODateOnly(getCurrentDate())
	const startDate = toISODateOnly(getDateCertainDaysAgo(30))
	const valueRequest = fetchRpc("get_depot_values", {
		p_depot_id: depots[0].id,
		p_interval_start: startDate,
		p_interval_end: endDate,
	})

	const [positionResponse, valueResponse] = await Promise.all([
		positionRequest,
		valueRequest,
	])

	if (positionResponse.error) {
		return {
			depots: depots,
			error: positionResponse.error,
			positions: null,
			depotValues: null,
		}
	}

	if (valueResponse.error) {
		return {
			depots: depots,
			error: valueResponse.error,
			positions: null,
			depotValues: null,
		}
	}

	return {
		depots: depots,
		error: null,
		positions: positionResponse.data,
		depotValues: valueResponse.data,
	}
})

function calculateProfits(depotValues: Omit<DepotValue, "id" | "depot_id">[]){
	const today = depotValues.at(-1) ?? depotValues[0]
	const yesterday = depotValues.at(-2) ?? depotValues[0]
	const start = depotValues[0]

	const valueToday = today.stock_assets + today.liquid_assets
	const valueYesterday = yesterday.stock_assets + yesterday.liquid_assets
	const valueStart = start.stock_assets + start.liquid_assets

	const profitToday = valueToday - valueYesterday

	const profitAllTime = valueToday - valueStart

	return {today: {
		value: valueToday,
		profit: profitToday,
		row: today
	}
    , start: {
        value: valueToday,
        profit: profitAllTime,
        row: start
    }, yesterday: {
		value: valueYesterday,
		row: yesterday
	}}
}