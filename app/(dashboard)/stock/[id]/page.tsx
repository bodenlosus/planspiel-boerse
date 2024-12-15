"use server";

import { Card } from "@/components/ui/card";
import {
  ChartCard,
  ErrorCard,
  StatCard,
  StockPositionCard,
} from "@/components/cards/cards";
import {
  getCurrentDate,
  getDateOneWeekAgo,
  getTimeBetweenDates,
  toISODateOnly,
} from "@/lib/date_utils";

import { IntervallContainer } from "./pick_intervall";
import PriceTable from "@/components/prices/table/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchStockData } from "@/database/fetch_stock_data";
import { formatter as formatPrices } from "@/lib/data/formatter";
import { urlSchema } from "./url_scheme";
import { getUser } from "@/database/get_user_server";
import { fetchRpc } from "@/database/fetch_rpc";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

// export async function generateStaticParams() {
//   const ids = await fetchStockIds(); // Fetch the array of IDs (1000+ IDs)
//   return ids.slice(0, 10).map(id => ({ id })); // Statically generate only the first 10
// }

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { start: string };
}) {
  let urlParams;
  try {
    urlParams = urlSchema({
      start: toISODateOnly(getDateOneWeekAgo()),
      end: toISODateOnly(getCurrentDate()),
    }).parse({
      ...searchParams,
      ...params,
      end: toISODateOnly(getCurrentDate()),
    });
  } catch (error) {
    console.error("Invalid URL parameters:", error);
    return <h1>Invalid URL parameters:</h1>;
  }
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const {depots, error, positions} = await dataFetcher(user, urlParams.id)
  const depot = depots ? depots[0] : null;
  
  const { info, prices, } = await fetchStockData(urlParams);

  


  if (error) {
    return (
      <main className="flex flex-row w-full h-full grow shrink justify-center items-center">
        <ErrorCard className="w-fit" error={error} />
      </main>
    );
  }
  const { dataWithEmptyDays: pricesWithEmptyDays, data: pricesFiltered } =
    formatPrices(prices);

  const startDate = new Date(urlParams.start);
  const endDate = getCurrentDate();

  return (
    <main className="w-full h-full overflow-hidden grid sm:grid-cols-2 md:grid-cols-3 gap-5">
      <StatCard
        className="col-span-3 md:col-span-2"
        currentPrice={prices.at(-1) ?? prices[0]}
        referencePrice={prices.at(-2) ?? prices[0]}
        stock={info[0]}
      />

      <StockPositionCard
        hidden={!depot}
        depot={await depot}
        position={(await positions)[0]}
        className="md:col-span-1 row-span-1 col-span-3"
        stock={{
          name: info[0].name as string,
          id: info[0].id as number,
          price: pricesFiltered[0].close,
        }}
      />
      <ChartCard
        className="col-span-3 row-span-2 md:row-start-2"
        prices={pricesWithEmptyDays}
        datePicker={
          <IntervallContainer
            defaultValue={getTimeBetweenDates(startDate, endDate)}
            id={urlParams.id}
          />
        }
      />
      <Card className="col-span-3 row-span-2 h-min">
        <ScrollArea className="w-full h-[400px] rounded-md border pr-3">
          <PriceTable prices={pricesFiltered.reverse()} />
        </ScrollArea>
      </Card>
    </main>
  );
}


async function dataFetcher(user: User, stockId: number) {
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
    "get_stock_position",
    { p_depot_id: depots[0].id, p_stock_id: stockId},
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
