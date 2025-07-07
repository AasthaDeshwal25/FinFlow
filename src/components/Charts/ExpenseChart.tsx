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
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No expense data available</p>
      </div>
    );
  }

  const monthlyData = transactions.reduce((acc, t) => {
    try {
      const date = new Date(t.date);
      if (isNaN(date.getTime())) return acc;

      const month = date.toLocaleString("en-IN", { month: "short", year: "numeric" });
      acc[month] = (acc[month] || 0) + (t.amount || 0);
      return acc;
    } catch {
      return acc;
    }
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  if (chartData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No valid expense data to display</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Monthly Expenses (₹)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(value)
            }
          />
          <Tooltip
            formatter={(value: number) => [new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value), "Amount"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
