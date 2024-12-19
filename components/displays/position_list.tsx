import { ReturnT } from "@/database/restructure_depot_position_data";
import { Card } from "../ui/card";
import { getStockPagePath } from "@/lib/get_stock_path";
import Link from "next/link";
import StockStats from "../stat/stats";
import { WinLossIndicator } from "../stat/indicator";

export default function PositionList({ positions }: { positions: Array<ReturnT> }) {
    return (
      <Card className="grid grid-cols-[fit-content(25%)_1fr] p-3 gap-3 rounded-xl">
  
        {positions.map((position, index) => (
          <PositionRow key={index} position={position}></PositionRow>
        ))}
      </Card>
    );
  }
  
  interface PositionRowProps extends React.ComponentPropsWithoutRef<"div"> {
    position: ReturnT;
  }
  
  export function PositionRow(
    { position: { currentPrice, stock, position } }: PositionRowProps,
  ) {
    const possesedValue = position.amount * currentPrice[0].close;
    const profit = currentPrice[0].close - currentPrice[1].close;
    
    return (
      <>
      <div className="p-4 appearance-none grid grid-cols-subgrid col-span-2 gap-3 border-b">
        <Link 
          href={getStockPagePath(stock.id)} 
          className="text-2xl font-bold col-span-1 flex flex-row gap-2 self-end hover:underline-offset-4 transition-all no-underline underline-offset-[-4ppx] hover:underline decoration-accent-foreground">
          <WinLossIndicator sign={Math.sign(profit)}/>
          {stock.symbol}
          </Link>
        <div className="w-fit flex flex-col gap-1">
          <div className="text-muted-foreground">
            {stock.name}
            </div>
          <div className="text-muted-foreground">{stock.description}</div>
        </div>
        <StockStats 
          className="mx-3 row-span-2 row-start-1 col-start-2 h-fit self-end" 
          structure={{
            amount: "You own",
            value: "Worth", 
            profit: "Profit",
            price: "Price per Stock"
          }} 
          current={{
            amount: position.amount,
            value:possesedValue, 
            profit: position.profit - position.expenses + possesedValue,
            price:currentPrice[0].close
          }} 
          reference={{
            price:currentPrice[1].close,
          }}
          labels={{
            price: ["today"],
          }}
          />
      </div>
      </>
    );
  }