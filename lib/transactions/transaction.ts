import TransactionCategorie from "@/lib/categories/categorie";
export default class Transaction {
  id: string;
  title: string;
  timestamp: Date;
  categorie: TransactionCategorie;
  amount: number;

  constructor(
    id: string,
    title: string,
    timestamp: Date,
    categorie: TransactionCategorie,
    amount: number,
  ) {
    this.id = id;
    this.title = title;
    this.timestamp = timestamp;
    this.categorie = categorie;
    this.amount = amount;
  }
}
