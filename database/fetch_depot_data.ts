import { supabase } from "@/utils/supabase/client";
import { Database } from "./supabase_types";

type Args = Database["public"]["Functions"]["get_depots_of_user"]["Args"];
type Returns = Database["public"]["Functions"]["get_depots_of_user"]["Returns"];

export interface ReturnT {
  depots: Returns;
  error?: Error;
}
export async function fetchDepotData({
  user_id,
}: Args): Promise<ReturnT> {
  // Handle responses and errors individually
  try {
    const { data, count } = await supabase.rpc("get_depots_of_user", {
      user_id: user_id,
    }, { count: "estimated" });

    // Check if the responses have data
    if (!count) {
      console.error("No depots found in the database");
      return {
        depots: [],
        error: new Error(`No depots present for user with ID ${user_id}`),
      };
    }

    return {
      depots: data,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      depots: [],
      error: new Error(`Failed to fetch depots`, { cause: error }),
    };
  }
}
