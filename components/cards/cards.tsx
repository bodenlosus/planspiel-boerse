import StockStats from "@/components/stat/stats"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type {
	CleanedStockPrice,
	NullableRow,
	Stock,
	StockPosition,
	StockPrice,
} from "@/database/custom_types"
import { to_display_string } from "@/lib/cash_display_string"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import type React from "react"
import type { ComponentPropsWithoutRef } from "react"
import ChartContainer from "../charts/container"
import { PositionSheet } from "../sheets/positions"
import BuyStockDialog from "../transaction_dialogs/buy_stock_dialog"
import SellStockDialog from "../transaction_dialogs/sell_stock_dialog"

type CardProps = ComponentPropsWithoutRef<"div">

interface StatCardProps extends CardProps {
	stock: Stock
	currentPrice: StockPrice
	referencePrice?: StockPrice
	dateString?: string
}
export function StatCard({
	className,
	stock,
	currentPrice,
	referencePrice,
	dateString,
}: StatCardProps) {
	return (
		<Card className={cn(className)}>
			<CardHeader className="flex-row flex-wrap justify-left gap-x-4 gap-y-1">
				<CardTitle className="text-3xl font-extrabold">
					{stock.symbol}
				</CardTitle>

				<h1>{stock.name}</h1>
				<Badge className="w-fit">{stock.description}</Badge>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-3">
				<StockStats
					structure={{
						close: "Close",
						open: "Open",
						high: "High",
						low: "Low",
						volume: "Volume",
					}}
					current={currentPrice}
					reference={referencePrice}
				/>
				<CardFooter className="h-min p-0">
					<span className="text-sm w-full text-right text-muted-foreground">
						{dateString ?? ""}
					</span>
				</CardFooter>
			</CardContent>
		</Card>
	)
}

interface ChartCardProps extends CardProps {
	prices: Array<CleanedStockPrice | NullableRow<StockPrice>>
	datePicker?: React.ReactNode
}

export function ChartCard({ prices, datePicker, className }: ChartCardProps) {
	return (
		<Card className={cn(className)}>
			<CardHeader className="flex-col gap-2">
				<CardDescription>Graph View</CardDescription>
				<CardTitle className="">
					{prices.at(0)?.timestamp} - {prices.at(-1)?.timestamp}
				</CardTitle>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-3">
				{datePicker}
				<ChartContainer data={prices} />
			</CardContent>
		</Card>
	)
}

interface ErrorCardProps extends CardProps {
	error: Error
}

export function ErrorCard({ error, className }: ErrorCardProps) {
	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle className="flex flex-row gap-1">
					<X className="stroke-destructive" />
					Failed to fetch data
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p>{error.message}</p>
			</CardContent>
			<CardFooter>
				<Badge className="w-fit">{error.name}</Badge>
			</CardFooter>
		</Card>
	)
}

interface StockPositionCardProps extends CardProps {
	stock: { name: string; id: number; price: number }
	depot?: { id: number; liquid_assets: number } | null
	position?: StockPosition
	hidden?: boolean
}
export function StockPositionCard({
	className,
	hidden,
	stock,
	depot,
	position,
}: StockPositionCardProps) {
	if (hidden || !depot) {
		return <></>
	}

	const buyLimit = Math.floor(depot.liquid_assets / stock.price)
	const sellLimit = position ? position.amount : 0

	return (
		<Card className={cn(className)}>
			<CardHeader className="flex-row flex-wrap justify-left gap-x-4 gap-y-1">
				<CardDescription className="">Your Positions</CardDescription>
			</CardHeader>
			<CardContent className="">
				<div className="flex flex-row flex-wrap gap-3 w-full *:flex-grow mb-3">
					<div className="px-4 py-2 flex flex-col flex-nowrap bg-background border border-border/20 rounded shadow-sm">
						<span className="text-sm text-muted-foreground">You own</span>

						<span className="text-sm flex flex-row items-baseline gap-1 text-muted-foreground">
							<span className="text-2xl font-mono font-normal text-foreground">
								{position ? position.amount : 0}
							</span>
						</span>
					</div>
					<div className="px-4 py-2 flex flex-col flex-nowrap bg-background border border-border/20 rounded shadow-sm">
						<span className=" text-muted-foreground text-sm">worth</span>

						<span className="text-sm flex flex-row items-baseline gap-1 text-muted-foreground">
							<span className="text-2xl font-mono font-normal text-foreground">
								{position
									? to_display_string(position.amount * stock.price, 2)
									: 0}
							</span>
						</span>
					</div>
				</div>
				<PositionSheet
					depotID={depot.id}
					stockID={stock.id}
					className="mb-4 w-full"
				/>
				<div className="grid grid-cols-2 gap-3">
					<BuyStockDialog
						stock={stock}
						depot={{ id: depot.id, monetaryAssets: depot.liquid_assets }}
						limit={buyLimit}
					/>
					<SellStockDialog
						stock={stock}
						depot={{ id: depot.id, monetaryAssets: depot.liquid_assets }}
						limit={sellLimit}
					/>
				</div>
			</CardContent>
		</Card>
	)
}
