import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

interface formProps {
  stock: {
    name: string;
    id: number;
    price: number;
  };
  availableBudget: number;
  onSubmit?: (values: onSubmitValues) => void;
}

export interface onSubmitValues { amount: number }

export default function BuyStockForm({ availableBudget, stock, onSubmit}: formProps) {
  const maxAmount = Math.floor(availableBudget / stock.price);
  const formSchema = z.object({
    amount: z
      .coerce.number({message: "Amount must be an Integer"}) // Coerces the input to a number
      .int({ message: "Amount must be an integer" }) // Ensures it's an integer
      .positive({ message: "Amount must be positive" }) // Checks that it's positive
      .max(maxAmount, { message: `Liquid assets only allow for ${maxAmount} stocks` }) // Limits it to the available budget
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
    },
  });

  // 2. Define a submit handler.

  function handleSubmit(values: z.infer<typeof formSchema>) {
    if (onSubmit){ onSubmit(values);}
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} type="text" />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}