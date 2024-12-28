"use client"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart"
import {
	Bar,
	Cell,
	ComposedChart,
	ErrorBar,
	type Tooltip,
	XAxis,
	YAxis,
} from "recharts"

import { formatFloatingPointString } from "@/lib/data/formatter"
import { cn } from "@/lib/utils"
import type React from "react"
import toRelativeValues, {
	toAbsoluteValues,
	type TtoRelativeValues,
} from "../../lib/data/data_utils"
import { WinLossIndicator } from "../stat/indicator"
import { Separator } from "../ui/separator"
import type { NullableRow } from "@/database/custom_types"

interface props<T extends Record<string, [number, number] | string | boolean>> extends React.ComponentPropsWithoutRef<"div"> {
	data: Array<T | NullableRow<T>>
	barKey: Extract<keyof T, string>
	errorKey: Extract<keyof T, string>
	winKey: Extract<keyof T, string>
	xKey: Extract<keyof T, string>
}
export default function CandleStickChart<T extends Record<string, [number, number] | string | boolean>>({ data, className, xKey, barKey, errorKey, winKey }: props<T>) {
	const chartData = data //data
	const chartConfig = {
		open: {
			label: "Open",
		},
		close: {
			label: "Open",
		},
	} satisfies ChartConfig

	return (
		<ChartContainer
			className={cn("min-h[200px]", className)}
			config={chartConfig}
		>
			<ComposedChart accessibilityLayer data={chartData}>
				<XAxis className="number" dataKey={xKey} interval="preserveStart" />
				<YAxis
					tickFormatter={(value) => formatFloatingPointString(value, 2)}
					className="number"
					padding={{ top: 20, bottom: 20 }}
					domain={["min", "max"]}
				/>
				<Bar dataKey={barKey} fill="hsl(var(--win))">
					{chartData.map((entry) => {
						const win = entry[winKey]
						return (
							<Cell
								key={entry[xKey] as string}
								radius={4}
								fillOpacity={0.6}
								stroke={win ? "hsl(var(--win))" : "hsl(var(--loss))"}
								fill={win ? "hsl(var(--win))" : "hsl(var(--loss))"}
							/>
						)
					})}
					<ErrorBar
						dataKey={errorKey}
						width={2}
						strokeWidth={2}
						stroke="hsl(var(--foreground)/.7)"
					/>
				</Bar>
				<ChartTooltip filterNull content={<CustomTooltip />} />
			</ComposedChart>
		</ChartContainer>
	)
}

type CustomToolTipProps = React.ComponentProps<typeof Tooltip>

const CustomTooltip = ({ active, payload, label }: CustomToolTipProps) => {
	if (!active || !payload || !payload.length) {
		return null
	}

	const dataPayload = payload[0].payload as TtoRelativeValues | null

	if (!dataPayload) {
		return null
	}
	const row = toAbsoluteValues(dataPayload)
	const displayValues = [
		{ name: "Open", string: formatFloatingPointString(row.open, 2) },
		{ name: "Close", string: formatFloatingPointString(row.close, 2) },
		{ name: "High", string: formatFloatingPointString(row.high, 2) },
		{ name: "Low", string: formatFloatingPointString(row.low, 2) },
	]
	const profit = row.close - row.open
	return (
		<div className="bg-background/60 backdrop-blur-lg p-2 rounded shadow border">
			<h1 className="font-semibold text-sm">{label}</h1>
			<Separator orientation="horizontal" className="mb-2" />
			<div className="grid grid-cols-4 gap-2">
				{displayValues.map((value) => (
					<>
						<span key={value.name} className="font-semibold">
							{value.name}
						</span>
						<span key={`${value.name}-${value}`} className="text-right number">
							{value.string}
						</span>
					</>
				))}
			</div>
			<Separator orientation="horizontal" className="my-2" />
			<span className="inline-flex flex-row gap-2">
				<span className="font-semibold">Profit:</span>
				<WinLossIndicator sign={Math.sign(row.close - row.open)} />
				<span className="label numeric">
					{row.closeLargerOpen ? "+" : "-"}
					{formatFloatingPointString(Math.abs(profit), 2)}
				</span>
			</span>
		</div>
	)
}
