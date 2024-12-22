import { getCurrentDate } from "@/lib/date_utils"
import { supabase } from "@/utils/supabase/client"

export async function buyStock(id: number, depot_id: number, amount: number) {
	const { data, error } = await supabase.rpc("buy_stock", {
		p_timestamp: getCurrentDate().toDateString(),
		p_stock_id: id,
		p_depot_id: depot_id,
		p_amount: amount,
	})

	if (error) {
		console.error("Error buying stock:", error)
	} else {
		console.log("bought stock:", data)
	}
	return { error }
}

export async function sellStock(id: number, depot_id: number, amount: number) {
	const { data, error } = await supabase.rpc("sell_stock", {
		p_timestamp: getCurrentDate().toDateString(),
		p_stock_id: id,
		p_depot_id: depot_id,
		p_amount: amount,
	})

	if (error) {
		console.error("Error buying stock:", error)
	} else {
		console.log("bought stock:", data)
	}
	return { error }
}
