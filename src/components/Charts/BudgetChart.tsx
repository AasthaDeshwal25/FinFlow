"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Budget, Transaction } from "@/types";

interface BudgetChartProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export default function BudgetChart({ budgets = [], transactions = [] }: BudgetChartProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear && t.type === 'expense';
  });

  const actualSpending = currentMonthTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = budgets.map(b => {
    const budgetAmount = b.period === 'yearly' ? b.amount / 12 : b.amount;
    const actualAmount = actualSpending[b.category] || 0;
    const percentage = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;
    return {
      category: b.category,
      budget: budgetAmount,
      actual: actualAmount,
      percentage,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  }).sort((a, b) => b.actual - a.actual);

  if (!chartData.length) {
    return <div className="p-4 text-center"><p className="text-gray-500">No valid budget data to display</p></div>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budget = payload.find((p: any) => p.dataKey === 'budget');
      const actual = payload.find((p: any) => p.dataKey === 'actual');
      const percentage = budget?.value ? (actual.value / budget.value) * 100 : 0;
      const remaining = budget.value - actual.value;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-green-600">Budget: ₹{budget.value.toLocaleString()}</p>
          <p className="text-blue-600">Actual: ₹{actual.value.toLocaleString()}</p>
          <p className={percentage > 100 ? "text-red-600" : "text-gray-600"}>{percentage.toFixed(1)}% of budget used</p>
          <p className={remaining < 0 ? "text-red-600" : "text-green-600"}>
            {remaining >= 0 ? "Remaining" : "Over by"}: ₹{Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Budget vs Actual Spending (₹)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" fill="#059669" name="Budget" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="#2563eb" name="Actual" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
