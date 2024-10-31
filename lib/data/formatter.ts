import { CleanedStockPrice, StockPrice } from "@/database/custom_types";

export function formatter(
  data: Array<StockPrice>,
): Array<CleanedStockPrice | null> {
  return data.map((price) => {
    if (isNullishRow(price)) {
      return null;
    }
    return {
      ...price,
      ...formatFloatingPoints(price),
      timestamp: formatTimeStamp(price.timestamp),
    } as CleanedStockPrice;
  });
}

function isNullishRow(row: Object): row is CleanedStockPrice {
  const values = Object.values(row);

  return values.includes(null) || values.includes(undefined);
}

export const formatFloatingPoints = (
  { open, close, high, low }: StockPrice,
) => ({
  open: open ? formatFloatingPoint(open, 2) : open,
  close: close ? formatFloatingPoint(close, 2) : close,
  high: high ? formatFloatingPoint(high, 2) : high,
  low: low ? formatFloatingPoint(low, 2) : low,
});
export const formatFloatingPoint = (
  value: number,
  digits: number,
): number | null => {
  const factor = Math.pow(10, digits);
  const integerPart = Math.floor(value);
  const fractionalPart = value - integerPart;
  const reducedFractionalPart = Math.floor(fractionalPart * factor) / factor;
  return integerPart + reducedFractionalPart;
};

export const formatFloatingPointString = (
  value: number,
  digits: number,
): string => {
  return value.toFixed(digits);
};

const formatTimeStamp = (timestamp: string): string =>
  new Date(timestamp).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
