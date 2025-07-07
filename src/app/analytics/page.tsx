"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import ExpenseChart from "@/components/Charts/ExpenseChart";
import CategoryChart from "@/components/Charts/CategoryChart";
import BudgetChart from "@/components/Charts/BudgetChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

interface Budget {
  id: string;
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
        fetch('/api/transactions'),
        fetch('/api/budgets')
      ]);

      if (!transactionsResponse.ok || !budgetsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [transactionsData, budgetsData] = await Promise.all([
        transactionsResponse.json(),
        budgetsResponse.json()
      ]);

      console.log('transactionsData:', transactionsData);
      console.log('budgetsData:', budgetsData);

      const transactionsArray = Array.isArray(transactionsData)
        ? transactionsData
        : transactionsData?.data ?? [];
      const budgetsArray = Array.isArray(budgetsData)
        ? budgetsData
        : budgetsData?.data ?? [];

      if (transactionsArray.length === 0) {
        setTransactions([]);
        setBudgets([]);
      } else {
        setTransactions(transactionsArray);
        setBudgets(budgetsArray);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => fetchData();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const totalExpenses = (transactions || [])
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = (transactions || [])
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = (budgets || []).reduce((sum, b) => sum + b.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

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
        <Alert className="max-w-md mx-auto">
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={fetchData} className="mt-2">Retry</Button>
        </Alert>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="container mx-auto p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-gray-500 mb-4">Add some transactions to see your analytics and spending patterns.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/transactions/add">Add Transaction</Link>
          </Button>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-gray-500">
              {(transactions || []).filter(t => t.type === 'expense').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-gray-500">
              {(transactions || []).filter(t => t.type === 'income').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Balance</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
            <p className="text-xs text-gray-500">
              {totalIncome - totalExpenses >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
            <PieChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-gray-500">{budgets.length} budget categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {transactions.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Monthly Expense Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseChart transactions={transactions.filter(t => t.type === 'expense')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart transactions={transactions.filter(t => t.type === 'expense')} />
              </CardContent>
            </Card>

            {budgets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Budget vs Actual Spending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BudgetChart
                    budgets={budgets}
                    transactions={transactions.filter(t => t.type === 'expense')}
                  />
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
              <p className="text-gray-500 mb-4">
                Add some transactions to see your analytics and spending patterns.
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/transactions/add">Add Transaction</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}