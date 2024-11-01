import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CleanedStockPrice, Stock, StockPrice } from "@/database/custom_types";

import { Badge } from "@/components/ui/badge";
import ChartContainer from "@/components/charts/container";
import { ComponentPropsWithoutRef } from "react";
import StockStats from "@/components/stat/stats";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import BuyStockDialog from "./buy_stock_dialog";

type CardProps = ComponentPropsWithoutRef<"div">;

interface StatCardProps extends CardProps {
  stock: Stock;
  currentPrice: StockPrice;
  referencePrice?: StockPrice;
  dateString?: string;
}
export function StatCard({
  className,
  stock,
  currentPrice,
  referencePrice,
  dateString,
}: StatCardProps) {
  referencePrice ??= currentPrice;
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex-row flex-wrap justify-left gap-x-4 gap-y-1">
        <CardTitle className="text-3xl font-extrabold">
          {stock.symbol}
        </CardTitle>

        <h1>{stock.name}</h1>
        <Badge className="w-fit">{stock.description}</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3">
        <StockStats price={currentPrice} referencePrice={referencePrice} />
        <CardFooter className="h-min p-0">
          <span className="text-sm w-full text-right text-muted-foreground">
            {dateString ?? ""}
          </span>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

interface ChartCardProps extends CardProps {
  prices: Array<CleanedStockPrice | null>;
  datePicker?: React.ReactNode;
}

export function ChartCard({ prices, datePicker, className }: ChartCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex-col gap-2">
        <CardTitle className="">Graph View</CardTitle>
        {prices.at(0)?.timestamp} - {prices.at(-1)?.timestamp}
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-3">
        {datePicker}
        <ChartContainer data={prices}></ChartContainer>
      </CardContent>
    </Card>
  );
}

interface ErrorCardProps extends CardProps {
  error: Error;
}

export function ErrorCard({ error, className }: ErrorCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex flex-row gap-1">
          <X className="stroke-destructive" />
          Failed to fetch data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error.message}</p>
      </CardContent>
      <CardFooter>
        <Badge className="w-fit">{error.name}</Badge>
      </CardFooter>
    </Card>
  );
}

interface StockPositionCardProps extends CardProps {
  stock: {name: string, id: number, price: number};
}
export function StockPositionCard({
  className,
  stock,
}: StockPositionCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex-row flex-wrap justify-left gap-x-4 gap-y-1">
        <CardTitle className="">
          Your Positions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3">
        {<BuyStockDialog
          stock={stock}
          depot={{id: 4, liquidAssets: 5000}}
        />}
        
      </CardContent>
    </Card>
  );
}
