import { cn } from "@/lib/utils";
import { StockStat } from "./stat";

type StockStatsProps<TStructure extends Record<string, string>> = {
  structure: TStructure;
  current: Record<keyof TStructure, number>;
  reference?: Partial<Record<keyof TStructure, number>>;
  className?: string;
};

export default function StockStats<TStructure extends Record<string, string>>(
  {structure, current, reference, className }: StockStatsProps<TStructure>) {
    const stats = Object.entries(structure)
    .map(([key, display]) => ({
      name: display,
      current: current[key],
      reference: reference ? reference[key] : undefined,
    }))
  
  return (
    <div className={cn("flex flex-row gap-3 flex-wrap", className)}>
      {stats.map((stat, index) => (
        <StockStat key={index} {...stat} />
      ))}
    </div>
  );
}