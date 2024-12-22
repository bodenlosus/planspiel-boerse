"use client"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart"
import {
	Area,
	ComposedChart,
	ReferenceLine,
	type Tooltip,
	XAxis,
	YAxis,
} from "recharts"

import { formatFloatingPointString } from "@/lib/data/formatter"
import { cn } from "@/lib/utils"
import { flattenOpenClose } from "../../lib/data/data_utils"
import { WinLossIndicator } from "../stat/indicator"
import { Separator } from "../ui/separator"
import type { props } from "./chart_props"

export default function AreaChart({ data, className }: props) {
	const startValue = data.find((item) => !item === false)?.open ?? 0
	const {
		data: chartData,
		maxValue,
		minValue,
	} = flattenOpenClose(data, -startValue) //data
	const chartConfig = {
		open: {
			label: "Open",
		},
		close: {
			label: "Open",
		},
	} satisfies ChartConfig

	const offset =
		(Math.abs(maxValue - startValue) / Math.abs(maxValue - minValue)) * 100

	return (
		<ChartContainer
			className={cn("min-h[200px]", className)}
			config={chartConfig}
		>
			<ComposedChart accessibilityLayer data={chartData}>
				<defs>
					<linearGradient id={"fill"} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={"hsl(var(--win))"} stopOpacity={0.7} />
						<stop
							offset={`${offset}%`}
							stopColor={"hsl(var(--win))"}
							stopOpacity={0.1}
						/>
						<stop
							offset={`${offset}%`}
							stopColor={"hsl(var(--loss))"}
							stopOpacity={0.1}
						/>
						<stop
							offset="100%"
							stopColor={"hsl(var(--loss))"}
							stopOpacity={0.7}
						/>
					</linearGradient>
					<linearGradient id={"stroke"} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={"hsl(var(--win))"} stopOpacity={1} />
						<stop
							offset={`${offset}%`}
							stopColor={"hsl(var(--win))"}
							stopOpacity={1}
						/>
						<stop
							offset={`${offset}%`}
							stopColor={"hsl(var(--loss))"}
							stopOpacity={1}
						/>
						<stop
							offset="100%"
							stopColor={"hsl(var(--loss))"}
							stopOpacity={1}
						/>
					</linearGradient>
				</defs>

				<XAxis className="number" dataKey={"date"} interval={"preserveStart"} />
				<YAxis
					dataKey={"value"}
					tickFormatter={(value) =>
						formatFloatingPointString(value + startValue, 2)
					}
					className="number"
					padding={{ top: 15, bottom: 15 }}
					domain={["min", "max"]}
				/>
				<ChartTooltip
					filterNull
					content={<CustomTooltip valueOffset={startValue} />}
				/>
				<ReferenceLine
					y={0}
					strokeWidth={0.5}
					isFront
					stroke="hsl(var(--foreground)/50)"
					strokeDasharray="6 3"
				/>
				<Area
					connectNulls={true}
					data={chartData}
					dataKey={"value"}
					fillOpacity={1}
					type="monotone"
					stroke="url(#stroke)"
					strokeWidth={2}
					fill="url(#fill)"
				/>
			</ComposedChart>
		</ChartContainer>
	)
}

interface CustomTooltipProps extends React.ComponentProps<typeof Tooltip> {
	valueOffset?: number
}

const CustomTooltip = ({
	active,
	payload,
	label,
	valueOffset,
}: CustomTooltipProps) => {
	if (!active || !payload || !payload.length) {
		return null
	}

	const value = Number.parseFloat(payload[0].value?.toString() ?? "")

	const displayString = Number.isNaN(value)
		? "No value"
		: formatFloatingPointString((value as number) + (valueOffset ?? 0), 2)

	return (
		<div className="bg-background/70 backdrop-blur-lg p-2 text-sm rounded shadow border">
			<h1 className="font-semibold">{label}</h1>
			<Separator orientation="horizontal" className="mb-2" />
			<p className="label inline-flex flex-row gap-2 number">
				<WinLossIndicator sign={Math.sign(value ?? 0)} /> {displayString}
			</p>
		</div>
	)
}
