'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PiggyBank, DollarSign, Target, TrendingUp } from 'lucide-react';
import { categories } from '@/data/categories';

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: string;
}

export default function BudgetForm() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'yearly'
  });
  const [loading, setLoading] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingBudget ? `/api/budgets/${editingBudget.id}` : '/api/budgets';
      const method = editingBudget ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        fetchBudgets();
        setFormData({ category: '', amount: '', period: 'monthly' });
        setEditingBudget(null);
      } else {
        alert('Error saving budget');
      }
    } catch (error) {
      alert('Error saving budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBudgets();
      } else {
        alert('Error deleting budget');
      }
    } catch (error) {
      alert('Error deleting budget');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Budget Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5" />
            {editingBudget ? 'Edit Budget' : 'Set Budget'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                          {category.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select 
                  value={formData.period} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, period: value as 'monthly' | 'yearly' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              {editingBudget && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingBudget(null);
                    setFormData({ category: '', amount: '', period: 'monthly' });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Set Budget'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Current Budgets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No budgets set yet</p>
              <p className="text-sm text-gray-400">Set your first budget to start tracking your spending goals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${getCategoryColor(budget.category)}`}></div>
                    <div>
                      <h3 className="font-medium">{getCategoryName(budget.category)}</h3>
                      <p className="text-sm text-gray-600 capitalize">{budget.period} budget</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatCurrency(budget.amount)}</p>
                      <p className="text-sm text-gray-600">
                        {budget.period === 'monthly' ? 'per month' : 'per year'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(budget)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(budget.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Tips */}
      <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Budget Tips
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>• Review and adjust your budgets monthly based on actual spending</li>
            <li>• Set realistic budgets that you can actually stick to</li>
            <li>• Consider seasonal variations in your spending patterns</li>
            <li>• Use budget alerts to stay on track with your goals</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}