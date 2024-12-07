import React, { HTMLAttributes } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchStockPosition } from "@/database/fetch_stock_position";
import { fetchDepotData } from "@/database/fetch_depot_data";
import { fetchDepotPosition } from "@/database/fetch_depot_positions";
import { getUser } from "@/database/get_user_server";
import { StockPosition } from "@/database/custom_types";
import { fetchRpc } from "@/database/fetch_rpc";
import { User } from "@supabase/supabase-js";
import { error } from "console";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorCard } from "@/components/cards/cards";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  restructure,
  ReturnT,
} from "@/database/restructure_depot_position_data";
import { to_display_string } from "@/lib/cash_display_string";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import StockStats from "@/components/stat/stats";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { depots, positions, error } = await dataFetcher(user);

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

function PositionList({ positions }: { positions: Array<ReturnT> }) {
  return (
    <Card className="grid grid-cols-[fit-content(10%)_auto] p-3 gap-3 rounded-xl">

      {positions.map((position, index) => (
        <PositionRow key={index} position={position}></PositionRow>
      ))}
    </Card>
  );
}

interface PositionRowProps extends React.ComponentPropsWithoutRef<"div"> {
  position: ReturnT;
}

function PositionRow(
  { position: { currentPrice, stock, position } }: PositionRowProps,
) {
  const possesedValue = position.amount * currentPrice.close;
  const boughtValue = position.amount * position.price
  
  return (
    <>
    <div className="p-4 grid grid-cols-subgrid col-span-2 gap-3">
      <div className="w-fit flex flex-col gap-1">
        <div className="text-2xl font-bold">{stock.symbol}</div>
        <div className="text-base text-muted-foreground">{stock.name}</div>
      </div>
      <StockStats 
        className="mx-3" 
        structure={{
          amount: "You own",
          value: "Worth", 
          price: "Price per Stock"
        }} 
        current={{
          amount: position.amount,
          value:possesedValue, 
          price:currentPrice.close
        }} 
        reference={{
          value:boughtValue, 
          price:currentPrice.open}}/>
    </div>
    </>
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
    { depot_id_param: depots[0].id },
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
