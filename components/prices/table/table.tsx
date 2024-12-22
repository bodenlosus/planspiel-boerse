import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import type { CleanedStockPrice } from "@/database/custom_types"
import { cn } from "@/lib/utils"
import type { CellValueTypes } from "./cell"
import PriceRow from "./row"

interface props extends React.ComponentPropsWithRef<"div"> {
	prices: Array<CleanedStockPrice>
}

export interface PriceColumnOptions {
	type: CellValueTypes
	indicator?: boolean
	display: string
}
export default function PriceTable({ prices, className }: props) {
	const columns: Record<string, PriceColumnOptions> = {
		timestamp: { type: "string", display: "Date" },
		profit: { type: "float", indicator: true, display: "Profit" },
		open: { type: "float", display: "Open" },
		close: { type: "float", display: "Close" },
		high: { type: "float", display: "High" },
		low: { type: "float", display: "Low" },
		volume: { type: "int", display: "Volume" },
	}
	return (
		<Table className={cn("min-h[200px]", className)}>
			<TableHeader>
				<TableRow className="bg-muted/50 border-b h-min">
					{Object.entries(columns).map(([name, { display }], index) => {
						const isEven = index % 2 === 0
						return (
							<TableHead
								key={name}
								className={cn(
									"h-8 text-base border-r font-semibold",
									isEven && "bg-muted/30",
									index > 0 ? "" : " w-fit",
								)}
							>
								{display}
							</TableHead>
						)
					})}
				</TableRow>
			</TableHeader>
			<TableBody>
				{prices.map((price) => {
					return (
						<PriceRow
							columns={columns}
							key={price.timestamp}
							price={{ ...price, profit: price.close - price.open }}
						/>
					)
				})}
			</TableBody>
		</Table>
	)
}
