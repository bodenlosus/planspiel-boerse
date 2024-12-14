import { redirect } from "next/navigation";
import { getUser } from "@/database/get_user_server";
import { fetchRpc } from "@/database/fetch_rpc";
import { User } from "@supabase/supabase-js";
import { ErrorCard } from "@/components/cards/cards";
import {
  restructure
} from "@/database/restructure_depot_position_data";
import PositionList from "@/components/displays/position_list";
export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { depots, positions, error } = await dataFetcher(user);

  console.log(depots)

  if (error) {
    return (
      <ErrorCard error={error}>
      </ErrorCard>
    );
  }

  return (
    <main>
      <PositionList positions={restructure(positions)}>
      </PositionList>
    </main>
  );
}



async function dataFetcher(user: User) {
  const depotResponse = await fetchRpc(
    "get_depots_of_user",
    { user_id: user.id },
  );

  if (depotResponse.error) {
    return ({
      depots: null,
      error: depotResponse.error,
      positions: null,
    });
  }
  if (depotResponse.count === 0) {
    return ({
      depots: null,
      error: new Error(`no depots present for user ${user.id}`),
      positions: null,
    });
  }

  const depots = depotResponse.data;

  const positionResponse = await fetchRpc(
    "get_depot_positions",
    { depot_id_param: depots[0].id, price_count_param:2 },
  );
  if (positionResponse.error) {
    return ({
      depots: depots,
      error: positionResponse.error,
      positions: null,
    });
  }

  return ({
    depots: depots,
    error: null,
    positions: positionResponse.data,
  });
}
