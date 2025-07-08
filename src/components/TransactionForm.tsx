"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categories } from "@/data/categories";

// ✅ Update: `date` is now a string (not Date)
interface TransactionFormProps {
  defaultValues?: {
    amount: number;
    date: string;
    description: string;
    category: string;
    type?: "credit" | "debit";
  };
  onSubmit: (data: {
    amount: number;
    date: string;
    description: string;
    category: string;
    type: "credit" | "debit";
  }) => void;
  onCancel?: () => void;
}

export default function TransactionForm({
  defaultValues,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: defaultValues?.amount || 0,
    date: defaultValues?.date || new Date().toISOString().split("T")[0],
    description: defaultValues?.description || "",
    category: defaultValues?.category || "",
    type: (defaultValues?.type || "debit") as "credit" | "debit",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.description.trim() || !formData.category.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount.toString()),
        date: formData.date, // ✅ keep as string now
      };

      await onSubmit(submitData);

      if (!defaultValues) {
        setFormData({
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          description: "",
          category: "",
          type: "debit",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span>{defaultValues ? "Edit Transaction" : "Add New Transaction"}</span>
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
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">Debit (Money Out)</SelectItem>
                <SelectItem value="credit">Credit (Money In)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="pl-8"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              formData.type === "credit"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            {isSubmitting
              ? "Processing..."
              : defaultValues
              ? "Update Transaction"
              : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
