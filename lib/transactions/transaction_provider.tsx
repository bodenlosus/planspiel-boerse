"use client";

import { createContext, useState } from "react";

import Transaction from "./transaction";

const t: Array<Transaction> = [] as const;

export const TransactionContext = createContext({
  items: t,
  add: (new_transactoins: Array<Transaction>) => {},
  remove: (id: string) => {},
});

export interface TransactionContextInterface {
  items: Array<Transaction>;
  add: (items: Array<Transaction>) => void;
  remove: (id: string) => void;
}

interface ProviderProps {
  children?: React.ReactNode | Array<React.ReactNode>;
}

export function TransactionProvider({ children }: ProviderProps) {
  const [transactions, setTransaction] = useState(t);

  function addTransaction(new_transaction: Array<Transaction>) {
    setTransaction([...transactions, ...new_transaction]);
  }

  function removeTransaction(id: string) {
    setTransaction(transactions.filter((t: Transaction) => t.id !== id));
  }
  const v: TransactionContextInterface = {
    items: transactions,
    add: addTransaction,
    remove: removeTransaction,
  };
  return (
    <TransactionContext.Provider
      value={v}
    >
      {children}
    </TransactionContext.Provider>
  );
}
