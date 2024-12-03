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
    <Card className="px-6 py-4 gap-4">
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
  const changeToday = currentPrice.close - currentPrice.open
  const relativeChangeToday = changeToday / currentPrice.open * 100 
  
  return (
    <div className="">
      <div className="w-full flex flex-row justify-between gap-6 text-xl font-semibold">
        <div>{stock.name}</div>
        <div>{to_display_string(possesedValue, 2)}</div>
      </div>
      <div className="w-full grid grid-cols-4">
        <div>{position.amount}</div>
        <div>{currentPrice.close}</div>
        <div>{changeToday.toFixed(2)} {relativeChangeToday.toFixed(2)}%</div>
      </div>
    </div>
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
