"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      let response;
      if (editingTransaction) {
        response = await fetch("/api/transactions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingTransaction._id, ...data }),
        });
      } else {
        response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save transaction");

      setEditingTransaction(null);
      await fetchTransactions();
      alert(editingTransaction ? "Transaction updated successfully!" : "Transaction added successfully!");
    } catch (error) {
      console.error("Error saving transaction:", error);
      if (error instanceof Error) {
        alert(`Failed to save transaction: ${error.message}`);
      } else {
        alert("Failed to save transaction: An unknown error occurred.");
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch("/api/transactions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to delete transaction");

        await fetchTransactions();
        alert("Transaction deleted successfully!");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        if (error instanceof Error) {
          alert(`Failed to delete transaction: ${error.message}`);
        } else {
          alert("Failed to delete transaction: An unknown error occurred.");
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Transaction Management</h1>
        <p className="text-gray-600">Track your income and expenses with detailed categorization</p>
      </div>

      {editingTransaction && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Edit Transaction</h2>
          <p className="text-blue-600">You are currently editing: {editingTransaction.description}</p>
        </div>
      )}

      <TransactionForm
        defaultValues={
          editingTransaction
            ? {
                amount: editingTransaction.amount,
                date: new Date(editingTransaction.date), // ✅ FIXED: convert string to Date
                description: editingTransaction.description,
                category: editingTransaction.category,
                type: editingTransaction.type,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={editingTransaction ? handleCancelEdit : undefined}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Transaction History</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
