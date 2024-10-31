import { PostgrestError } from "@supabase/supabase-js";
import { Stock } from "./custom_types";
import { supabase } from "../utils/supabase/client";

export interface TgetStockFromSearchString {
  stocks: Array<Stock>;
  error: PostgrestError | null;
  success: boolean;
}

export async function getStockFromSearchString(
  searchQuery: string,
  limit: number,
): Promise<TgetStockFromSearchString> {
  const { data, error } = await supabase
    .rpc("search_stock_info", { search_query: searchQuery, limit_arg: limit });

  if (error) {
    console.error("Error:", error);
    return { stocks: [], error, success: false };
  }

  if (!Array.isArray(data)) {
    console.error("No data found in the database");
    return { stocks: [], error: null, success: false };
  }
  if (data.length === 0) {
    console.error("No matching stocks found");
    return { stocks: [], error: null, success: false };
  }

  return { stocks: data, error: null, success: true };
}
