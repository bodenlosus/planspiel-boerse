"use client";

import { sellStock } from "@/database/stock_transactions";
import PrimitiveDialog, {
  TDepot,
  TStock,
  TTransactionHandler,
} from "./primitive_dialog";

const handleStockSale: TTransactionHandler = async (
  stock,
  amount,
  depot,
) => {
  const { error } = await sellStock(stock.id, depot.id, amount);
  if (error) {
    return { error: error, success: null };
  }
  return {
    error: null,
    success: {
      message: `Successfully sold ${stock.name} x ${amount} for ${
        (amount * stock.price).toFixed(2)
      } USD`,
    },
  };
};

export default function SellStockDialog(
  props: { stock: TStock; depot: TDepot, limit: number },
) {
  return (
    <PrimitiveDialog
      title="Sell Stock"
      action="Sell"
      reload
      triggerVariant="outline"
      {...props}
      handleTransaction={handleStockSale}
    />
  );
}