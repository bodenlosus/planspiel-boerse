"use client"
import "./container.css"
import {
	CandlestickChart as CandleStickIcon,
	LineChart as LinechartIcon,
} from "lucide-react"

import toRelativeValues, { calculateOffset, flattenOpenClose } from "@/lib/data/data_utils"
import type React from "react"
import CandleStickChart from "./candle_stick"
import type { props as ChartProps } from "./chart_props"
import { ChartContainer as CContainer, Chart, ChartIcon } from "./container2"
import AreaChart from "./value_area"

interface props extends ChartProps, React.ComponentPropsWithoutRef<"div"> {}

export default function ChartContainer({ data }: props) {
	const areaData = flattenOpenClose(data)
	const area = calculateOffset(areaData, "value")

	const candleData = toRelativeValues(data)
	return (
		<CContainer
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
			<ChartIcon name="candlestick">
				<CandleStickIcon className="size-7 md:size-5 stroke-muted-foreground" />
			</ChartIcon>
			<ChartIcon name="line">
				<LinechartIcon className="size-7 md:size-5 stroke-muted-foreground" />
			</ChartIcon>
		</CContainer>
	)
}
