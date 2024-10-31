import { WinLossIndicator } from "./indicator";

interface props {
  name: string;
  values: { current: number | null; previous: number | null };
}
export function StockStat({ name, values }: props) {
  if (!values.current || !values.previous) {
    return <div>Insufficient data.</div>; // Display a message if no data is available.
  }
  const relativeChange =
    ((values.current - values.previous) / values.previous) * 100;

  return (
    <div className="w-min overflow-hidden bg-background rounded-sm shadow-sm border border-border/20 px-4 py-2 flex-grow flex-shrink">
      <h1 className=" text-sm">{name}</h1>
      <span className="flex flex-row gap-x-2 gap-y-0 flex-wrap">
        <span className="flex flex-row gap-1">
          <span className="flex align-baseline">
            <WinLossIndicator sign={relativeChange}></WinLossIndicator>
          </span>
          <span className="text-xl font-semibold number">{values.current}</span>
        </span>
        <span className="text-sm font-semibold text-muted-foreground number float-right">
          {relativeChange > 0 ? "+" : "-"}
          {Math.abs(relativeChange).toFixed(2)}%
        </span>
      </span>
    </div>
  );
}
