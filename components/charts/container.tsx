"use client"
import "./container.css"
import {
	CandlestickChart as CandleStickIcon,
	LineChart as LinechartIcon,
} from "lucide-react"

import toRelativeValues, {
	calculateOffset,
	flattenOpenClose,
} from "@/lib/data/data_utils"

import type {
	CleanedStockPrice,
	NullableRow,
	StockPrice,
} from "@/database/custom_types"
import { type ComponentPropsWithoutRef, useMemo } from "react"
import AreaChart from "./area"
import CandleStickChart from "./candle_stick"
import Chart from "./primitive/chart"
import ChartIcon from "./primitive/chart_icon"
import ChartContainer from "./primitive/container"

export interface props extends ComponentPropsWithoutRef<"div"> {
	data: Array<CleanedStockPrice | NullableRow<StockPrice>>
	timeframe?: { start: string; end: string }
}
export default function StockChartContainer({ data }: props) {
	const areaData = useMemo(() => flattenOpenClose(data), [data])
	const area = useMemo(() => calculateOffset(areaData, "value"), [areaData])

	const area2 = useMemo(() => calculateOffset(data, "close"), [data])

	const candleData = toRelativeValues(data)
	return (
		<ChartContainer
			defaultName="line"
			className="w-full border rounded-md bg-muted/50 shadow overflow-hidden"
		>
			<Chart name="candlestick">
				<CandleStickChart
					className="aspect-[4/3] md:aspect-[20/9] lg:aspect-[6/2] xl:aspect-[8/2]"
					data={candleData}
					xKey="date"
					barKey="open_close"
					errorKey="high_low"
					winKey="closeLargerOpen"
					lineKey="absClose"
				/>
			</Chart>
			<Chart name="line">
				<AreaChart
					className="aspect-[4/3] md:aspect-[20/9] lg:aspect-[6/2] xl:aspect-[8/2]"
					data={areaData}
					dataKey="value"
					xKey="date"
					yKey="value"
					offset={area.offset}
					startValue={area.startValue}
				/>
			</Chart>
			<Chart name="line2">
				<AreaChart
					className="aspect-[4/3] md:aspect-[20/9] lg:aspect-[6/2] xl:aspect-[8/2]"
					data={data}
					dataKey="close"
					xKey="timestamp"
					yKey="close"
					offset={area2.offset}
					startValue={area2.startValue}
				/>
			</Chart>
			<ChartIcon name="candlestick">
				<CandleStickIcon className="size-7 md:size-5 stroke-muted-foreground" />
			</ChartIcon>
			<ChartIcon name="line">
				<LinechartIcon className="size-7 md:size-5 stroke-muted-foreground" />
			</ChartIcon>
			<ChartIcon name="line2">
				<LinechartIcon className="size-7 md:size-5 stroke-muted-foreground" />
			</ChartIcon>
		</ChartContainer>
	)
}
