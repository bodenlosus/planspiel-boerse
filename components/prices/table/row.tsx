import PriceCell from "./cell";
import { PriceColumnOptions } from "./table";
import { TableRow } from "@/components/ui/table";

interface PriceRowProps extends React.ComponentPropsWithoutRef<"div"> {
  price: Record<string, number | string>;
  columns: Record<string, PriceColumnOptions>;
}
export default function PriceRow({ price, columns }: PriceRowProps) {
  return (
    <TableRow className="border-r h-min">
      {Object.entries(columns)
        .map((col, columnIndex) => (
          <PriceCell
            key={columnIndex}
            columnIndex={columnIndex}
            value={price[col[0]]}
            options={col[1]}
          />
        ))}
    </TableRow>
  );
}
