"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction } from "@/types";

const COLORS = [
  "#059669",
  "#2563eb",
  "#fbbf24",
  "#1e40af",
  "#fcd34d",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
];

interface CategoryChartProps {
  transactions: Transaction[];
}

export default function CategoryChart({ transactions = [] }: CategoryChartProps) {
  const categoryData = transactions
    .filter((t) => t.type === "debit")
    .reduce((acc, t) => {
      const category = t.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No category data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(data.value)}
          </p>
          <p className="text-sm text-gray-500">
            {((data.value / chartData.reduce((s, i) => s + i.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Spending by Category (₹)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            dataKey="value"
            label={({ percent }) =>
              percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
            }
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => {
              const amount = entry?.payload?.value
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(entry.payload.value)
                : "N/A";
              return (
                <span style={{ color: entry.color }}>
                  {value} – {amount}
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
