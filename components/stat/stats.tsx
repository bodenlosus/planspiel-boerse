import { StockPrice } from "@/database/custom_types";
import { StockStat } from "./stat";

interface props {
  price: StockPrice | null;
  referencePrice: StockPrice | null;
}
export default function StockStats({ price, referencePrice }: props) {
  if (!price || !referencePrice) {
    return <div>Insufficient data.</div>; // Display a message if no data is available.
  }
  const stats = [
    {
      name: "Open",
      current: price.open,
      previous: referencePrice.open,
    },
    {
      name: "Close",
      current: price.close,
      previous: referencePrice.close,
    },
    {
      name: "High",
      current: price.high,
      previous: referencePrice.high,
    },
    {
      name: "Low",
      current: price.low,
      previous: referencePrice.low,
    },
    {
      name: "Volume",
      current: price.volume,
      previous: referencePrice.volume,
    },
  ];
  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {stats.map((stat, index) => (
        <StockStat key={index} name={stat.name} values={stat} />
      ))}
    </div>
  );
}
