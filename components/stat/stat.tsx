import { to_display_string } from "@/lib/cash_display_string";
import { WinLossIndicator } from "./indicator";

interface props {
  name: string;
  current: number;
  reference?: number;
}
export function StockStat({ name, current, reference }: props) {
  return (
    <div className="w-min overflow-hidden bg-background rounded-sm shadow-sm border border-border/20 px-4 py-2 flex-grow flex-shrink">
      <h1 className=" text-sm">{name}</h1>
      {(reference) ? <DiplayTwoValues current={current} reference={reference}/>: <DisplaySingleValue current={current}/>  }
    </div>
  );
}

interface DisplaySingleValueT {
  current: number;
}

function DisplaySingleValue({current}:DisplaySingleValueT){
  return (
    <span className="flex flex-row gap-x-2 gap-y-0 flex-wrap">
        <span className="flex flex-row gap-1">
          <span className="text-xl font-semibold number">{to_display_string(current, 2)}</span>
        </span>
      </span>
  )
}

interface DisplayTwoValuesT extends DisplaySingleValueT {
  reference: number;
}

function DiplayTwoValues({current, reference}:DisplayTwoValuesT){
  const relativeChange = ((current - reference) / reference) * 100;
  return (
    <span className="flex flex-row gap-x-2 gap-y-0 flex-wrap">
        <span className="flex flex-row gap-1">

          <span className="flex align-baseline">
            <WinLossIndicator sign={relativeChange}></WinLossIndicator>
          </span>

          <span className="text-xl font-semibold number">{to_display_string(current, 2)}</span>
        </span>
        <span className="text-sm font-semibold text-muted-foreground number float-right">
          {relativeChange > 0 ? "+" : "-"}
          {Math.abs(relativeChange).toFixed(2)}%
        </span>
      </span>
  )
}