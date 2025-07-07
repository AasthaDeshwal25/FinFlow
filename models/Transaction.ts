export interface Transaction {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  type: 'credit' | 'debit'; // Added type field for credit/debit
  createdAt?: Date;
  updatedAt?: Date;
}