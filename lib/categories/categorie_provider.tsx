import { createContext, useState } from "react";

import TransactionCategorie from "./categorie";

const c: Array<TransactionCategorie> = [
  new TransactionCategorie("groceries", "Groceries"),
  new TransactionCategorie("cosmetics", "Cosmetics"),
] as const;

export const CategorieContext = createContext({
  items: c,
  add: (new_categories: Array<TransactionCategorie>) => {},
});

export interface CategorieContextInterface {
  items: Array<TransactionCategorie>;
  add: (items: Array<TransactionCategorie>) => void;
}

interface ProviderProps {
  children?: React.ReactNode | Array<React.ReactNode>;
}

export function CategorieProvider({ children }: ProviderProps) {
  const [categories, setCategories] = useState(c);

  function addCategories(new_categories: Array<TransactionCategorie>) {
    setCategories([...categories, ...new_categories]);
  }

  return (
    <CategorieContext.Provider
      value={{ items: categories, add: addCategories }}
    >
      {children}
    </CategorieContext.Provider>
  );
}
