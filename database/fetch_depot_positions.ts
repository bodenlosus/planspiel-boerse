import { supabase } from "@/utils/supabase";
import { Database } from "./supabase_types";
import { createRpcFetcher, fetchRpc } from "./fetch_rpc";

type Args = Database["public"]["Functions"]["get_depot_positions"]["Args"];
type Returns =
  Database["public"]["Functions"]["get_depot_positions"]["Returns"];
