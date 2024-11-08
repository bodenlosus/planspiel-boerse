import { StockPrice } from "./custom_types";

import { supabase } from "@/utils/supabase/client";
interface TfetchLastPrices {
  prices: Array<StockPrice>;
  success: boolean;
}
export async function fetchLastPrices(args: {
  id: number;
  limit: number;
}): Promise<TfetchLastPrices> {
  // Handle responses and errors individually
  try {
    const priceResponse = await supabase.rpc("get_last_stock_prices", {
      p_stock_id: args.id,
      limit_arg: args.limit,
    }, { count: "estimated" });

    // Check if the responses have data
    if (!priceResponse.count) {
      console.error("No data found in the database");
      return { prices: [], success: false };
    }

    return {
      prices: priceResponse.data,
      success: true,
    };
  } catch (error) {
    console.error("Error:", error);
  }
  return {
    prices: [],
    success: false,
  };
}


