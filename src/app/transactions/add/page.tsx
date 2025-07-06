"use client";

import TransactionForm from "@/components/TransactionForm";

export default function AddTransactionPage() {
  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to add transaction");
      alert("Transaction added successfully! Redirecting...");
      window.location.href = "/transactions";
    } catch (error) {
      console.error("Error adding transaction:", error);
      if (error instanceof Error) {
        alert(`Failed to add transaction: ${error.message}`);
      } else {
        alert("Failed to add transaction due to an unknown error.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">Add Transaction</h1>
      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
}
