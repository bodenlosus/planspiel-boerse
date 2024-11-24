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
  onSubmit?: (values: onSubmitValues) => void;
  limit: number;
}

export interface onSubmitValues {
  amount: number;
}

export default function BuyStockForm(
  { onSubmit, limit }: formProps,
) {
  const formSchema = z.object({
    amount: z
      .coerce.number({ message: "Amount must be an Integer" }) // Coerces the input to a number
      .int({ message: "Amount must be an integer" }) // Ensures it's an integer
      .positive({ message: "Amount must be positive" }) // Checks that it's positive
      .max(limit, {
        message: `Only ${limit} stocks are possible`,
      }), // Limits it to the available budget
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: limit,
    },
  });

  // 2. Define a submit handler.

  function handleSubmit(values: z.infer<typeof formSchema>) {
    if (onSubmit) onSubmit(values);
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
                Amount of stocks for transaction
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Proceed</Button>
      </form>
    </Form>
  );
}
