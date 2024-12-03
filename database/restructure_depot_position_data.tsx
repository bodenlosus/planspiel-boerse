import { CleanedStockPrice, Stock, StockPosition } from "./custom_types";
import { Database } from "./supabase_types";

type dataT = Database["public"]["Functions"]["get_depot_positions"]["Returns"];
export type ReturnT = {
  stock: Stock;
  currentPrice: CleanedStockPrice;
  position: StockPosition;
};
export function restructure(data: dataT): Array<ReturnT> {
  return data.map((row) => ({
    stock: {
      id: row.id,
      name: row.name,
      symbol: row.symbol,
      description: row.description,
    },
    currentPrice: {
      close: row.close,
      high: row.high,
      low: row.low,
      open: row.open,
      timestamp: row.timestamp,
      volume: row.volume,
      price_id: row.price_id,
      stock_id: row.stock_id,
    },
    position: {
      amount: row.amount,
      date: row.date,
      depot_id: row.depot_id,
      id: row.id,
      price: row.price,
      stock_id: row.stock_id,
    },
  }));
}
