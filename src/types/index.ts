export interface Transaction {
  id: string;
  _id?: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'credit' | 'debit'; 
  createdAt?: string;
  updatedAt?: string;
}


export interface Budget {
  id: string;
  _id?: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  color: string;
  icon?: string;
  createdAt?: string;
}

export interface DashboardStats {
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
  topCategories: { category: string; amount: number; }[];
}

export interface BudgetComparison {
  category: string;
  budget: number;
  actual: number;
  percentage: number;
  status: 'good' | 'warning' | 'over';
}

export interface MonthlyData {
  month: string;
  amount: number;
  income?: number;
  expenses?: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color?: string;
}