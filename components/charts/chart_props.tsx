import { CleanedStockPrice } from "@/database/custom_types";
import { ComponentPropsWithoutRef } from "react";

export interface props extends ComponentPropsWithoutRef<"div"> {
  data: Array<CleanedStockPrice | null>;
}
