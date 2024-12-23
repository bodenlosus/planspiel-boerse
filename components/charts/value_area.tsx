"use client"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart"
import type { NullableRow } from "@/database/custom_types"
import { to_display_string } from "@/lib/cash_display_string"
import { relativeTimeString } from "@/lib/date_utils"
import { cn } from "@/lib/utils"
import type React from "react"
import {
	Area,
	ComposedChart,
	ReferenceLine,
	type Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import { WinLossIndicator } from "../stat/indicator"
import { Separator } from "../ui/separator"
interface props<T extends Record<string, number | string>>
	extends React.ComponentPropsWithoutRef<"div"> {
	data: Array<T | NullableRow<T>>
	offset: number
	dataKey: Extract<keyof T, string>
	xKey: Extract<keyof T, string>
	yKey: Extract<keyof T, string>
	startValue: number
}

export default function AreaChart<T extends Record<string, number | string>>({
	data,
	dataKey,
	offset,
	className,
	xKey,
	yKey,
	startValue,
}: props<T>) {
	const chartData = data.map((item) => {
		if (!item[dataKey]) {
			return item[dataKey]
		}
		return {
			...item,
			[dataKey]: (item[dataKey] as number) - startValue,
		}
	})
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
				<defs>
					<linearGradient id={"fill"} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={"hsl(var(--win))"} stopOpacity={0.7} />
						<stop
							offset={`${offset * 100}%`}
							stopColor={"hsl(var(--win))"}
							stopOpacity={0.1}
						/>
						<stop
							offset={`${offset * 100}%`}
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
							offset={`${offset * 100}%`}
							stopColor={"hsl(var(--win))"}
							stopOpacity={1}
						/>
						<stop
							offset={`${offset * 100}%`}
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

				<XAxis className="number" dataKey={xKey} interval={"preserveStart"} />
				<YAxis
					dataKey={yKey}
					tickFormatter={(value) => to_display_string(value + startValue, 2)}
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
					dataKey={dataKey}
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
		: to_display_string((value as number) + (valueOffset ?? 0), 2)

	return (
		<div className="bg-background/70 backdrop-blur-lg p-2 text-sm rounded shadow border">
			<h1 className="font-semibold">{relativeTimeString(new Date(label))}</h1>
			<Separator orientation="horizontal" className="mb-2" />
			<p className="label inline-flex flex-row gap-2 number">
				<WinLossIndicator sign={Math.sign(value ?? 0)} /> {displayString}
			</p>
		</div>
	)
}
