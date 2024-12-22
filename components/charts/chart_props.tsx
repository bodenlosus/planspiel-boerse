import type {
	CleanedStockPrice,
	NullableRow,
	StockPrice,
} from "@/database/custom_types"
import type { ComponentPropsWithoutRef } from "react"

export interface props extends ComponentPropsWithoutRef<"div"> {
	data: Array<CleanedStockPrice | NullableRow<StockPrice>>
}
