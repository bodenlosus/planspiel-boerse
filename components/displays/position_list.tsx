import type { ReturnT } from "@/database/restructure_depot_position_data"
import { getStockPagePath } from "@/lib/get_stock_path"
import Link from "next/link"
import type React from "react"
import { WinLossIndicator } from "../stat/indicator"
import StockStats from "../stat/stats"
import { Card } from "../ui/card"
import "./style.css"
export default function PositionList({
	positions,
}: { positions: Array<ReturnT> }) {
	return (
		<Card className="grid grid-cols-[fit-content(25%)_1fr] p-3 gap-3 rounded-xl">
			{positions.map((position) => (
				<PositionRow key={position.stock.id} position={position} />
			))}
		</Card>
	)
}

interface PositionRowProps extends React.ComponentPropsWithoutRef<"div"> {
	position: ReturnT
}

export function PositionRow({
	position: { currentPrice, stock, position },
}: PositionRowProps) {
	const possesedValue = position.amount * currentPrice[0].close
	const profit = currentPrice[0].close - currentPrice[1].close

	return (
		<>
			<div className="p-3 grid grid-cols-subgrid col-span-2 gap-3 border-b">
				<Link
					href={getStockPagePath(stock.id)}
					className="text-2xl ml-3 font-bold col-span-1 flex items-end self-end flex-row gap-2 h-min hover:underline-offset-4 transition-all no-underline underline-offset-[-4ppx] hover:underline decoration-accent-foreground"
				>
					<WinLossIndicator sign={Math.sign(profit)} />
					{stock.symbol}
				</Link>
				<div className="w-fit flex flex-row gap-2 flex-wrap items-baseline h-min self-end pb-1">
					<div className="text-foreground">{stock.name}</div>
					<div className="text-muted-foreground text-sm hidden md:block">
						{stock.description}
					</div>
				</div>
				<StockStats
					className="row-span-1 row-start-2 col-start-1 h-fit self-end grid *:w-auto grid-cols-2 md:grid-cols-4 last:col-end-[-1] gap-0 *:rounded-none rounded-md overflow-hidden shadow"
					structure={{
						amount: "You own",
						value: "Worth",
						profit: "Profit",
						price: "Price per Stock",
					}}
					current={{
						amount: position.amount,
						value: possesedValue,
						profit: position.profit - position.expenses + possesedValue,
						price: currentPrice[0].close,
					}}
					reference={{
						price: currentPrice[1].close,
					}}
					labels={{
						price: ["today"],
					}}
				/>
			</div>
		</>
	)
}
