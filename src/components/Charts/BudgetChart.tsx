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

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

interface BudgetChartProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export default function BudgetChart({ budgets = [], transactions = [] }: BudgetChartProps) {
  // Handle undefined or empty data
  if (!budgets || budgets.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No budget data available</p>
        <p className="text-sm text-gray-400">Set up budgets to see budget vs actual spending comparison</p>
      </div>
    );
  }

  // Get current month for filtering transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(t => {
    try {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             t.type === 'expense';
    } catch (error) {
      console.warn('Error parsing transaction date:', t.date, error);
      return false;
    }
  });

  // Aggregate transactions by category
  const actualSpending = currentMonthTransactions.reduce((acc, t) => {
    if (!t.category || !t.amount) {
      console.warn('Invalid transaction data:', t);
      return acc;
    }
    
    acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  const chartData = budgets.map((budget) => {
    const budgetAmount = budget.period === 'yearly' ? budget.amount / 12 : budget.amount;
    const actualAmount = actualSpending[budget.category] || 0;
    const percentage = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;
    
    return {
      category: budget.category,
      budget: budgetAmount,
      actual: actualAmount,
      percentage: percentage,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  }).sort((a, b) => b.actual - a.actual);

  if (chartData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No valid budget data to display</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budget = payload.find((p: any) => p.dataKey === 'budget');
      const actual = payload.find((p: any) => p.dataKey === 'actual');
      
      if (budget && actual) {
        const percentage = budget.value > 0 ? (actual.value / budget.value) * 100 : 0;
        const remaining = budget.value - actual.value;
        
        return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold mb-2">{label}</p>
            <div className="space-y-1">
              <p className="text-green-600">
                Budget: {new Intl.NumberFormat("en-IN", { 
                  style: "currency", 
                  currency: "INR" 
                }).format(budget.value)}
              </p>
              <p className="text-blue-600">
                Actual: {new Intl.NumberFormat("en-IN", { 
                  style: "currency", 
                  currency: "INR" 
                }).format(actual.value)}
              </p>
              <p className={`text-sm ${percentage > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                {percentage.toFixed(1)}% of budget used
              </p>
              <p className={`text-sm ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                {new Intl.NumberFormat("en-IN", { 
                  style: "currency", 
                  currency: "INR" 
                }).format(Math.abs(remaining))}
              </p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Budget vs Actual Spending (₹) - Current Month
      </h2>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Total Budget</p>
          <p className="text-lg font-semibold text-green-700">
            {new Intl.NumberFormat("en-IN", { 
              style: "currency", 
              currency: "INR",
              minimumFractionDigits: 0
            }).format(chartData.reduce((sum, item) => sum + item.budget, 0))}
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">Total Spent</p>
          <p className="text-lg font-semibold text-blue-700">
            {new Intl.NumberFormat("en-IN", { 
              style: "currency", 
              currency: "INR",
              minimumFractionDigits: 0
            }).format(chartData.reduce((sum, item) => sum + item.actual, 0))}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-600">Overall Usage</p>
          <p className="text-lg font-semibold text-purple-700">
            {((chartData.reduce((sum, item) => sum + item.actual, 0) / 
               chartData.reduce((sum, item) => sum + item.budget, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
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
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" fill="#059669" name="Budget" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="#2563eb" name="Actual" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Budget Status Indicators */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{item.category}</p>
              <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}% used</p>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              item.status === 'over' ? 'bg-red-100 text-red-800' :
              item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {item.status === 'over' ? 'Over Budget' :
               item.status === 'warning' ? 'Near Limit' :
               'On Track'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}