"use client"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart"
import type { NullableRow } from "@/database/custom_types"
import { to_display_string } from "@/lib/cash_display_string"
import {
	relativeDateStringCompact,
	toAbsoluteTimeString,
} from "@/lib/date_utils"
import { cn } from "@/lib/utils"
import type React from "react"
import {
	Area,
	AreaChart as RechartsAreaChart,
	ReferenceLine,
	type Tooltip,
	XAxis,
	YAxis,
} from "recharts"
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
			<RechartsAreaChart accessibilityLayer data={data}>
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

				<XAxis
					className="number"
					dataKey={xKey}
					interval={7}
					tickFormatter={(timestamp) =>
						relativeDateStringCompact(new Date(timestamp))
					}
				/>
				<YAxis
					dataKey={yKey}
					tickFormatter={(value) => to_display_string(value, 2)}
					className="number"
					padding={{ top: 15, bottom: 15 }}
					domain={["min", "max"]}
				/>
				<ChartTooltip
					isAnimationActive={false}
					filterNull
					content={<CustomTooltip />}
				/>
				<ReferenceLine
					y={startValue}
					strokeWidth={0.5}
					isFront
					stroke="hsl(var(--foreground)/50)"
					strokeDasharray="6 3"
				/>
				<Area
					baseValue={startValue}
					connectNulls={true}
					data={data}
					dataKey={dataKey}
					fillOpacity={1}
					type="linear"
					stroke="url(#stroke)"
					strokeWidth={2}
					fill="url(#fill)"
				/>
			</RechartsAreaChart>
		</ChartContainer>
	)
}

type CustomTooltipProps = React.ComponentProps<typeof Tooltip>

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	if (!active || !payload || !payload.length) {
		return null
	}

	const value = Number.parseFloat(payload[0].value?.toString() ?? "")
	const valueType = payload[0].payload?.type ?? ""

	const displayString = Number.isNaN(value)
		? "No value"
		: to_display_string(value as number, 2)
	const date = new Date(label)
	return (
		<div className="bg-background p-2 text-sm rounded shadow border">
			<h1 className="">
				<span className="font-semibold">{toAbsoluteTimeString(date)}</span>
			</h1>
			<Separator orientation="horizontal" className="my-2 col-span-2" />
			<p className="label inline-flex flex-row gap-2">
				<span className="number">{displayString}</span>
				<span className="">{valueType}</span>
			</p>
		</div>
	)
}
