"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Loader2, TrendingUp, PieChart, BarChart3, Plus,
  ArrowUp, ArrowDown, Target
} from "lucide-react";

import ExpenseChart from "@/components/Charts/ExpenseChart";
import CategoryChart from "@/components/Charts/CategoryChart";
import BudgetChart from "@/components/Charts/BudgetChart";

interface Transaction {
  id: string;
  _id?: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'credit' | 'debit';
}

interface Budget {
  id: string;
  _id?: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: string;
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsResponse, budgetsResponse] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budgets"),
      ]);

      if (!transactionsResponse.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactionsData = await transactionsResponse.json();
      const transactionsArray = Array.isArray(transactionsData)
        ? transactionsData
        : transactionsData?.transactions || transactionsData?.data || [];

      const mappedTransactions: Transaction[] = transactionsArray.map((t: any) => ({
        ...t,
        id: t._id || t.id || crypto.randomUUID(),
        type: t.type === "income" ? "credit" : t.type === "expense" ? "debit" : t.type,
      }));

      setTransactions(mappedTransactions);

      if (budgetsResponse.ok) {
        const budgetsData = await budgetsResponse.json();
        const budgetsArray = Array.isArray(budgetsData)
          ? budgetsData
          : budgetsData?.budgets || budgetsData?.data || [];

        const mappedBudgets: Budget[] = budgetsArray.map((b: any, index: number) => ({
          id: b._id || b.id || `budget-${index}`,
          _id: b._id,
          category: b.category,
          amount: b.amount,
          period: b.period,
          createdAt: b.createdAt || new Date().toISOString(),
        }));

        setBudgets(mappedBudgets);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err instanceof Error ? err.message : "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalIncome = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const netBalance = totalIncome - totalExpenses;

  const budgetUsage = budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.type === "debit" && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
    };
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert className="max-w-md mx-auto border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
          <Button onClick={fetchData} className="mt-3 bg-red-600 hover:bg-red-700 text-white">
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your financial performance and spending patterns</p>
        </div>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analytics Data Available</h3>
            <p className="text-gray-500 mb-6">Add some transactions to see analytics.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/transactions/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/transactions">View Transactions</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your financial performance and spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-gray-500">
              {transactions.filter((t) => t.type === "credit").length} credit transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-gray-500">
              {transactions.filter((t) => t.type === "debit").length} debit transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Balance</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(netBalance)}
            </div>
            <p className="text-xs text-gray-500">{netBalance >= 0 ? "Surplus" : "Deficit"}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Budget Usage</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-gray-500">{budgets.length} budget categories</p>
          </CardContent>
        </Card>
      </div>

      {budgets.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Budget Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetUsage.map((budget) => (
              <Card key={budget._id} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-700 capitalize">{budget.category}</h4>
                    <span className={`text-sm px-2 py-1 rounded ${
                      budget.percentage > 100
                        ? "bg-red-100 text-red-800"
                        : budget.percentage > 80
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(budget.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Budget:</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(budget.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining:</span>
                      <span className={`font-semibold ${
                        budget.remaining >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {formatCurrency(budget.remaining)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        budget.percentage > 100
                          ? "bg-red-500"
                          : budget.percentage > 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`} style={{ width: `${Math.min(budget.percentage, 100)}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Expense Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ExpenseChart transactions={transactions.filter((t) => t.type === "debit")} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CategoryChart transactions={transactions.filter((t) => t.type === "debit")} />
          </CardContent>
        </Card>

        {budgets.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Budget vs Actual Spending
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <BudgetChart budgets={budgets} transactions={transactions.filter((t) => t.type === "debit")} />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/transactions/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/budgets">
              <Target className="w-4 h-4 mr-2" />
              Set Budget
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/transactions">View All Transactions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
