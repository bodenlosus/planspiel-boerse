import { getCurrentDate } from "@/lib/date_utils";
import { supabase } from "@/utils/supabase/client";

export async function buyStock(
  id: number,
  depot_id: number,
  amount: number,
) {
  const { data, error } = await supabase.rpc("buy_stock", {
    timestamp: getCurrentDate().toDateString(),
    stock_id: id,
    depot_id: depot_id,
    amount: amount,
  });

  if (error) {
    console.error("Error buying stock:", error);
  } else {
    console.log("bought stock:", data);
  }
  return { error };
}
