"use client"

import { buyStock } from "@/database/stock_transactions"
import PrimitiveDialog, {
	type TDepot,
	type TStock,
	type TTransactionHandler,
} from "./primitive_dialog"

const handleStockPurchase: TTransactionHandler = async (
	stock,
	amount,
	depot,
) => {
	const { error } = await buyStock(stock.id, depot.id, amount)
	if (error) {
		console.error("Error buying stock:", error)
		return { error: error, success: null }
	}
	return {
		error: null,
		success: {
			message: `Successfully bought ${stock.name} x ${amount} for ${(
				amount * stock.price
			).toFixed(2)} USD`,
		},
	}
}

export default function BuyStockDialog(props: {
	stock: TStock
	depot: TDepot
	limit: number
}) {
	return (
		<PrimitiveDialog
			reload
			title="Buy Stock"
			action="Buy"
			{...props}
			handleTransaction={handleStockPurchase}
		/>
	)
}
