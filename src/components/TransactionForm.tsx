"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/data/categories";

interface TransactionFormProps {
  defaultValues?: {
    amount: number;
    date: Date;
    description: string;
    category: string;
    type?: 'credit' | 'debit';
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function TransactionForm({ defaultValues, onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: defaultValues?.amount || 0,
    date: defaultValues?.date ? new Date(defaultValues.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: defaultValues?.description || "",
    category: defaultValues?.category || "",
    type: defaultValues?.type || 'debit' as 'credit' | 'debit'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount.toString()),
        date: new Date(formData.date)
      };
      
      await onSubmit(submitData);
      
      // Reset form if not editing
      if (!defaultValues) {
        setFormData({
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          description: "",
          category: "",
          type: 'debit'
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span>{defaultValues ? 'Edit Transaction' : 'Add New Transaction'}</span>
          {onCancel && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancel}
              className="bg-white text-emerald-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Transaction Type *
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Debit (Money Out)
                  </span>
                </SelectItem>
                <SelectItem value="credit">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Credit (Money In)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount (₹) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="pl-8"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
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

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full ${
              formData.type === 'credit' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {isSubmitting ? 'Processing...' : (defaultValues ? 'Update Transaction' : 'Add Transaction')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}