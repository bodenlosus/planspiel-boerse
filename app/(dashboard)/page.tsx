import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchStockPosition } from "@/database/fetch_stock_position";
import { fetchDepotData } from "@/database/fetch_depot_data";
import { fetchDepotPosition } from "@/database/fetch_depot_positions";
import { getUser } from "@/database/get_user_server";
import { StockPosition } from "@/database/custom_types";

export default async function Page() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login");
  }
  const {depots, error} = await fetchDepotData({user_id:user.id})
  if (error) {
    console.error("Error fetching depots:", error);
    return;
  }
  const {positions} = await fetchDepotPosition({p_depot_id:depots[0].id})

  console.log(positions)

  return (
    <main>
      {}
    </main>
  );
}

// function PositionList({positions}:{positions:Array<StockPosition>}){
//   return (
//     <ul>
//       {positions.map((position) => (
//         <li key={position.id}>
//           {position.id} ({position.id} shares)
//         </li>
//       ))}
//     </ul>
//   )
// }