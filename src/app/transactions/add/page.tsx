"use client";

import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/navigation";

export default function AddTransactionPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount.toString()),
          date: new Date(data.date),
          type: data.type === "credit" ? "credit" : "debit", // Map to consistent API format
        }),
      });

      if (response.ok) {
        router.push("/transactions"); // Redirect to transactions page instead of dashboard
      } else {
        alert("Error saving transaction");
      }
    } catch (error) {
      alert("Error saving transaction");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <TransactionForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/transactions")}
      />
    </div>
  );
}