import { supabase } from "@/utils/supabase/client";
import { Database } from "./supabase_types";

type Args = Database["public"]["Functions"]["get_stock_position"]["Args"];
type Returns = Database["public"]["Functions"]["get_stock_position"]["Returns"];

export interface ReturnT {
  positions: Returns;
  error?: Error;
}
export async function fetchDepotPositions({
  p_depot_id,
  p_stock_id
}: Args): Promise<ReturnT> {
  // Handle responses and errors individually
  try {
    const { data, count } = await supabase.rpc("get_stock_position", {
      p_depot_id:p_depot_id, p_stock_id:p_stock_id
    }, { count: "estimated" });

    // Check if the responses have data
    if (!count) {
      console.warn(`no positions found for depot ${p_depot_id} on stock ${p_stock_id} `);
      return {
        positions: [],
      };
    }

    return {
      positions: data,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      positions: [],
      error: new Error(`Failed to fetch positions`, { cause: error }),
    };
  }
}
