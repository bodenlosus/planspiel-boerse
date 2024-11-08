"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { buyStock } from "@/database/buy_stock";
import BuyStockForm, { onSubmitValues } from "./buy_stock_form";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import React from "react";

interface props extends React.ComponentPropsWithoutRef<"div"> {
  stock: {
    name: string;
    id: number;
    price: number;
  };
  depot: {
    id: number;
    liquid_assets: number;
  };
}

export default function BuyStockDialog({ stock, depot }: props) {
  const handleStockPurchase = async ({ amount }: onSubmitValues) => {
    toast({
      title: "Processing Buy Request",
      description: `${stock.name} ${amount}x for ${stock.price * amount} USD`,
    });

    const { error } = await buyStock(stock.id, depot.id, amount);

    if (error) {
      toast({
        title: "Could not buy stock",
        description: error?.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Bought Stock",
      description: `${stock.name} ${amount}x for ${stock.price * amount} USD`,
    });
    setOpen(false);
  };

  const [isOpen, setOpen] = React.useState(false);
  const { toast } = useToast();
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Buy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Stock</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <BuyStockForm
          stock={stock}
          availableBudget={depot.liquid_assets}
          onSubmit={handleStockPurchase}
        />
      </DialogContent>
    </Dialog>
  );
}
