import { Minus, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WinLossIndicatorProps {
  sign: number;
}
export function WinLossIndicator({ sign }: WinLossIndicatorProps) {
  const className = "size-4 self-center";
  if (sign > 0) {
    return (
      <Triangle className={cn("fill-win stroke-transparent", className)} />
    );
  } else if (sign < 0) {
    return (
      <Triangle
        className={cn("fill-loss stroke-transparent -scale-y-100", className)}
      />
    );
  }
  return <Minus className={cn("stroke-foreground", className)}></Minus>;
}
