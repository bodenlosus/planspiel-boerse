import { Stock, StockPrice } from "./custom_types";
import { fetchRpc } from "./fetch_rpc";

export interface TfetchStockData {
  info: Array<Stock>;
  prices: Array<StockPrice>;
  error?: Error;
}
export async function fetchStockData(args: {
  id: number;
  start: string;
  end: string;
}): Promise<TfetchStockData> {
  // Handle responses and errors individually
  try {
    const [infoResponse, priceResponse] = await Promise.all([
      fetchRpc("get_stock_info_by_id", {
        p_stock_id: args.id,
      }),
      fetchRpc("get_stock_prices_by_interval", {
        p_stock_id: args.id,
        p_interval_start: args.start,
        p_interval_end: args.end,
      }),
    ]);

    // Check if the responses have data
    if (!infoResponse.count || !priceResponse.count) {
      console.error("No data found in the database");
      return {
        info: [],
        prices: [],
        error: new Error(`No data present for ${args.start} - ${args.end}`),
      };
    }

    return {
      info: infoResponse.data,
      prices: priceResponse.data,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      info: [],
      prices: [],
      error: new Error(`Failed to fetch data`, { cause: error }),
    };
  }
}
