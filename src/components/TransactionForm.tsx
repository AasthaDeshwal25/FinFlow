"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/categories";
import { useEffect } from "react";

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  defaultValues?: TransactionFormValues;
  onSubmit: (data: TransactionFormValues) => Promise<void>;
  onCancel?: () => void;
}

export default function TransactionForm({ defaultValues, onSubmit, onCancel }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "",
    },
  });

  
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleSubmit = async (data: TransactionFormValues) => {
    try {
      await onSubmit(data);
      if (!defaultValues) {
        form.reset({
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          description: "",
          category: "",
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-md mx-auto p-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="border-emerald-600 focus:ring-emerald-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="border-emerald-600 focus:ring-emerald-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter description"
                  {...field}
                  className="border-emerald-600 focus:ring-emerald-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-emerald-600 focus:ring-emerald-700">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-600 text-white"
          >
            {defaultValues ? "Update Transaction" : "Add Transaction"}
          </Button>
          {defaultValues && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-600 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}