"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TrendingUp, PieChart, BarChart3, Plus, ArrowUp, ArrowDown, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import ExpenseChart from "@/components/Charts/ExpenseChart";
import CategoryChart from "@/components/Charts/CategoryChart";
import BudgetChart from "@/components/Charts/BudgetChart";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "credit" | "debit";
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  period: "monthly" | "yearly";
  createdAt: string;
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch(`${baseUrl}/api/transactions`),
        fetch(`${baseUrl}/api/budgets`)
      ]);

      if (!transactionsRes.ok) throw new Error("Failed to fetch transactions");

      const transactionsJson = await transactionsRes.json();
      const budgetsJson = budgetsRes.ok ? await budgetsRes.json() : [];

      const transactionsArray = Array.isArray(transactionsJson)
        ? transactionsJson
        : transactionsJson?.transactions || transactionsJson?.data || [];

      const mappedTransactions = transactionsArray.map((t: any) => ({
        ...t,
        type: t.type === "income" ? "credit" : t.type === "expense" ? "debit" : t.type
      }));

      setTransactions(mappedTransactions);

      const budgetsArray = Array.isArray(budgetsJson)
        ? budgetsJson
        : budgetsJson?.budgets || budgetsJson?.data || [];

      setBudgets(budgetsArray);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const totalExpenses = transactions.filter(t => t.type === "debit").reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalIncome = transactions.filter(t => t.type === "credit").reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const netBalance = totalIncome - totalExpenses;

  const budgetUsage = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === "debit" && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0
    };
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert className="max-w-md mx-auto border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
          <Button onClick={fetchData} className="mt-3 bg-red-600 hover:bg-red-700 text-white">Retry</Button>
        </Alert>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 mb-6">Track your financial performance and spending patterns</p>
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-600 mb-2">No Analytics Data Available</p>
        <p className="text-gray-500 mb-6">Add transactions to begin tracking.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/transactions/add"><Plus className="w-4 h-4 mr-2" /> Add Transaction</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/transactions">View Transactions</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Income",
            icon: <ArrowUp className="h-4 w-4 text-green-500" />,
            value: formatCurrency(totalIncome),
            note: `${transactions.filter(t => t.type === "credit").length} credit transactions`,
            color: "text-green-600"
          },
          {
            label: "Total Expenses",
            icon: <ArrowDown className="h-4 w-4 text-red-500" />,
            value: formatCurrency(totalExpenses),
            note: `${transactions.filter(t => t.type === "debit").length} debit transactions`,
            color: "text-red-600"
          },
          {
            label: "Net Balance",
            icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
            value: formatCurrency(netBalance),
            note: netBalance >= 0 ? "Surplus" : "Deficit",
            color: netBalance >= 0 ? "text-green-600" : "text-red-600"
          },
          {
            label: "Budget Usage",
            icon: <Target className="h-4 w-4 text-purple-500" />,
            value: formatCurrency(totalBudget),
            note: `${budgets.length} budget categories`,
            color: "text-purple-600"
          }
        ].map((item, idx) => (
          <Card key={idx} className="border-0 shadow-lg">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{item.label}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <p className="text-xs text-gray-500">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Overview */}
      {budgets.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Budget Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetUsage.map(budget => (
              <Card key={budget._id} className="border-0 shadow-lg">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-700 capitalize">{budget.category}</h4>
                    <span className={`text-sm px-2 py-1 rounded ${
                      budget.percentage > 100 ? "bg-red-100 text-red-800" :
                      budget.percentage > 80 ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-sm flex justify-between"><span>Spent:</span><span className="font-semibold text-red-600">{formatCurrency(budget.spent)}</span></div>
                  <div className="text-sm flex justify-between"><span>Budget:</span><span className="font-semibold text-blue-600">{formatCurrency(budget.amount)}</span></div>
                  <div className="text-sm flex justify-between"><span>Remaining:</span><span className={`font-semibold ${budget.remaining >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(budget.remaining)}</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        budget.percentage > 100 ? "bg-red-500" :
                        budget.percentage > 80 ? "bg-yellow-500" :
                        "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="space-y-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Monthly Expense Trends</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ExpenseChart transactions={transactions.filter(t => t.type === "debit")} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5" /> Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CategoryChart transactions={transactions.filter(t => t.type === "debit")} />
          </CardContent>
        </Card>

        {budgets.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Budget vs Actual Spending</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <BudgetChart budgets={budgets} transactions={transactions.filter(t => t.type === "debit")} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link href="/transactions/add"><Plus className="w-4 h-4 mr-2" /> Add Transaction</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/budgets"><Target className="w-4 h-4 mr-2" /> Set Budget</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/transactions">View All Transactions</Link>
        </Button>
      </div>
    </div>
  );
}
