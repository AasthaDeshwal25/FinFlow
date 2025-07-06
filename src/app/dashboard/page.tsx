"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  AlertTriangle,
  Loader2
} from "lucide-react";
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

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetStatus: {
    totalBudget: number;
    totalSpent: number;
    percentage: number;
    overBudgetCategories: number;
  };
  recentTransactions: Transaction[];
  topCategories: { category: string; amount: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

      console.log('Fetched transactions data:', transactionsData);
      console.log('Fetched budgets data:', budgetsData);

      const transactionsArray = Array.isArray(transactionsData.transactions)
        ? transactionsData.transactions
        : Array.isArray(transactionsData)
          ? transactionsData
          : [];

      const budgetsArray = Array.isArray(budgetsData.budgets)
        ? budgetsData.budgets
        : Array.isArray(budgetsData)
          ? budgetsData
          : [];

      const dashboardStats = calculateDashboardStats(transactionsArray, budgetsArray);
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardStats = (transactions: Transaction[], budgets: Budget[]): DashboardStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const monthlyBudgets = budgets.map(b => ({
      ...b,
      monthlyAmount: b.period === 'yearly' ? b.amount / 12 : b.amount
    }));

    const totalBudget = monthlyBudgets.reduce((sum, b) => sum + b.monthlyAmount, 0);

    const budgetSpending = monthlyBudgets.reduce((acc, budget) => {
      const spent = currentMonthTransactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      acc[budget.category] = { budget: budget.monthlyAmount, spent };
      return acc;
    }, {} as Record<string, { budget: number; spent: number }>);

    const overBudgetCategories = Object.values(budgetSpending).filter(
      ({ budget, spent }) => spent > budget
    ).length;

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const categorySpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categorySpending)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      budgetStatus: {
        totalBudget,
        totalSpent: monthlyExpenses,
        percentage: totalBudget > 0 ? (monthlyExpenses / totalBudget) * 100 : 0,
        overBudgetCategories
      },
      recentTransactions,
      topCategories
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return <div className="container mx-auto p-6">No data available</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">
          Financial Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your financial overview for {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.monthlyIncome)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.monthlyExpenses)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <ArrowDownRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.netBalance)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stats.netBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <Wallet className={`h-6 w-6 ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                <p className={`text-2xl font-bold ${stats.budgetStatus.percentage > 100 ? 'text-red-600' : stats.budgetStatus.percentage > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {stats.budgetStatus.percentage.toFixed(1)}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${stats.budgetStatus.percentage > 100 ? 'bg-red-100' : stats.budgetStatus.percentage > 80 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                <Target className={`h-6 w-6 ${stats.budgetStatus.percentage > 100 ? 'text-red-600' : stats.budgetStatus.percentage > 80 ? 'text-yellow-600' : 'text-green-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alert */}
      {stats.budgetStatus.overBudgetCategories > 0 && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You're over budget in {stats.budgetStatus.overBudgetCategories} category{stats.budgetStatus.overBudgetCategories > 1 ? 'ies' : ''}.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Transactions
              </span>
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-blue-700">
                <Link href="/transactions">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentTransactions.length > 0 ? (
              <div className="divide-y">
                {stats.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                Top Spending Categories
              </span>
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-purple-700">
                <Link href="/analytics">View Analytics</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.topCategories.length > 0 ? (
              <div className="divide-y">
                {stats.topCategories.map((category, index) => (
                  <div key={category.category} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-gray-600">
                            {((category.amount / stats.monthlyExpenses) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{formatCurrency(category.amount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No spending data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="h-auto p-4 bg-emerald-600 hover:bg-emerald-700">
            <Link href="/transactions/add" className="flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Add Transaction</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/budgets" className="flex flex-col items-center gap-2">
              <Target className="w-6 h-6" />
              <span>Manage Budgets</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/analytics" className="flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>View Analytics</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/reports" className="flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>Generate Report</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
