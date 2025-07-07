"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types";

interface ExpenseChartProps {
  transactions: Transaction[];
}

export default function ExpenseChart({ transactions = [] }: ExpenseChartProps) {
  // Convert 'credit' → 'income', 'debit' → 'expense'
  const converted = transactions.map((t) => ({
    ...t,
    type: t.type === "credit" ? "income" : "expense",
  }));

  const expenseTransactions = converted.filter((t) => t.type === "expense");

  if (expenseTransactions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No expense data available</p>
      </div>
    );
  }

  const monthlyData = expenseTransactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const key = date.toLocaleString("en-IN", { month: "short", year: "numeric" });
    acc[key] = (acc[key] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .sort(
      (a, b) => new Date("1 " + a.month).getTime() - new Date("1 " + b.month).getTime()
    );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Monthly Expenses (₹)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value: number) => [
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(value),
              "Amount",
            ]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
