import { redirect } from "next/navigation";
import { getUser } from "@/database/get_user_server";
import { fetchRpc } from "@/database/fetch_rpc";
import { User } from "@supabase/supabase-js";
import { ErrorCard } from "@/components/cards/cards";
import {
  restructure
} from "@/database/restructure_depot_position_data";
import PositionList from "@/components/displays/position_list";
import { getCurrentDate, getDateCertainDaysAgo, toISODateOnly } from "@/lib/date_utils";
export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { depots, positions, depotValues, error } = await dataFetcher(user);

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
      depotValues: null,
    });
  }
  if (depotResponse.count === 0) {
    return ({
      depots: null,
      error: new Error(`no depots present for user ${user.id}`),
      positions: null,
      depotValues: null,
    });
  }

  const depots = depotResponse.data;

  const positionRequest = fetchRpc(
    "get_depot_positions",
    { depot_id_param: depots[0].id, price_count_param:2 },
  );

  const startDate = toISODateOnly(getCurrentDate())
  const endDate = toISODateOnly(getDateCertainDaysAgo(30))
  const valueRequest = fetchRpc("get_depot_values", {
    p_depot_id:depots[0].id, 
    p_interval_start:startDate, 
    p_interval_end:endDate
  })

  const [positionResponse, valueResponse] = await Promise.all([positionRequest, valueRequest])

  if (positionResponse.error) {
    return ({
      depots: depots,
      error: positionResponse.error,
      positions: null,
      depotValues: null,
    });
  }

  if (valueResponse.error) {
    return ({
      depots: depots,
      error: valueResponse.error,
      positions: null,
      depotValues: null,
    });
  }

  return ({
    depots: depots,
    error: null,
    positions: positionResponse.data,
    depotValues: valueResponse.data,
  });
}
