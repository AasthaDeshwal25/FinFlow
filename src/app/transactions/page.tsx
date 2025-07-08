// TransactionPage.tsx

"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/types";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import axios from "axios";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions");
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleSubmit = async (data: {
    amount: number;
    date: Date;
    description: string;
    category: string;
    type: "credit" | "debit";
  }) => {
    try {
      if (editingTransaction) {
        const response = await axios.put(`/api/transactions/${editingTransaction._id}`, {
          ...data,
        });
        fetchTransactions();
      } else {
        const response = await axios.post("/api/transactions", {
          ...data,
        });
        fetchTransactions();
      }
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        {!showForm && (
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Transaction
          </Button>
        )}
      </div>

      {showForm ? (
        <TransactionForm
          defaultValues={
            editingTransaction
              ? {
                  amount: editingTransaction.amount,
                  date: editingTransaction.date.split("T")[0],
                  description: editingTransaction.description,
                  category: editingTransaction.category,
                  type: editingTransaction.type,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
