"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard, ErrorCard, StatCard } from "@/components/cards/cards";
import {
  getCurrentDate,
  getDateOneWeekAgo,
  getTimeBetweenDates,
  toISODateOnly,
} from "@/lib/date_utils";

import { IntervallContainer } from "./pick_intervall";
import PriceTable from "@/components/prices/table/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchStockData } from "@/database/fetch_data";
import { formatter as formatPrices } from "@/lib/data/formatter";
import { urlSchema } from "./url_scheme";

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
    console.error("Invalid URL parameters:");
    return <h1>Invalid URL parameters:</h1>;
  }

  const { info, prices, error } = await fetchStockData(urlParams);

  if (error) {
    return (
      <main className="flex flex-row w-full h-full grow shrink justify-center items-center">
        <ErrorCard className="w-fit" error={error} />
      </main>
    );
  }

  prices.reverse();
  const formattedPrices = formatPrices(prices);

  const startDate = new Date(urlParams.start);
  const endDate = getCurrentDate();

  return (
    <main className="w-full h-full overflow-hidden grid sm:grid-cols-2 md:grid-cols-3 gap-5">
      <StatCard
        className="col-span-3 md:col-span-2"
        currentPrice={prices[0]}
        referencePrice={prices[1]}
        stock={info[0]}
      />

      <Card className="md:col-span-1 row-span-1 col-span-3">
        <CardHeader className="flex-row gap-2">
          <CardTitle className="">Your Assets</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="">
            <span>521</span> Stocks worth 128.000€
          </div>
          <div className="">
            <span></span>
          </div>
        </CardContent>
      </Card>
      <ChartCard
        className="col-span-3 row-span-2 md:row-start-2"
        prices={formattedPrices}
        datePicker={
          <IntervallContainer
            defaultValue={getTimeBetweenDates(startDate, endDate)}
            id={urlParams.id}
          />
        }
      />
      <Card className="col-span-3 row-span-2 h-min">
        <ScrollArea className="w-full h-[400px] rounded-md border pr-3">
          <PriceTable prices={formattedPrices.reverse()} />
        </ScrollArea>
      </Card>
    </main>
  );
}
