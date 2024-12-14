import { Database } from "./supabase_types";

export type StockPrice = {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
  volume: number;
}
export type Stock = Database["public"]["Tables"]["StockInfo"]["Row"];

export type NonNullableRow<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
export type CleanedStockPrice = NonNullableRow<StockPrice>;
export type CleanedStock = NonNullableRow<Stock>;

export type StockPosition = {
  id: number;
  date: string;
  depot_id: number;
  stock_id: number;
  amount: number;
  expenses: number;
  profit: number;
};
