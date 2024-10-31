import "./container.css";

import {
  CandlestickChart as CandleStickIcon,
  LineChart as LinechartIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AreaChart from "./area";
import CandleStickChart from "./candle_stick";
import { props as ChartProps } from "./chart_props";

interface props extends ChartProps, React.ComponentPropsWithoutRef<"div"> {}

export default function ChartContainer({ data, className }: props) {
  return (
    <Tabs
      defaultValue="line"
      className="w-full border rounded-md bg-muted/50 shadow overflow-hidden"
    >
      <TabsContent value="candlestick">
        <CandleStickChart
          className="aspect-[4/3] md:aspect-[20/9] lg:aspect-[6/2] xl:aspect-[8/2]"
          data={data}
        />
      </TabsContent>
      <TabsContent value="line">
        <AreaChart
          className="aspect-[4/3] md:aspect-[20/9] lg:aspect-[6/2] xl:aspect-[8/2]"
          data={data}
        />
      </TabsContent>
      <div className="w-full h-fit p-2 bg-background border-t md:p-0">
        <TabsList className="bg-transparent flex flex-row gap-2 justify-around justify-items-stretch md:justify-start">
          <TabsTrigger
            className="grow md:grow-0 data-[state=active]:bg-secondary *:data-[state=active]:stroke-foreground hover:bg-secondary/50 hover:*:stroke-foreground transition-colors *:transition-colors"
            value="candlestick"
          >
            <CandleStickIcon className="size-7 md:size-5 stroke-muted-foreground" />
          </TabsTrigger>
          <TabsTrigger
            value="line"
            className="grow md:grow-0 data-[state=active]:bg-secondary *:data-[state=active]:stroke-foreground *:hover:stroke-foreground hover:bg-secondary/50 transition-colors *:transition-colors"
          >
            <LinechartIcon className="size-7 md:size-5 stroke-muted-foreground" />
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}
