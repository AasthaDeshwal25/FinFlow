"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Edit, Trash2, ArrowUp, ArrowDown, Filter
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { categories } from "@/data/categories";
import { Transaction } from "@/types"; // ✅ Using global type

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id;

  const getCategoryColor = (id: string) =>
    categories.find((c) => c.id === id)?.color || "bg-gray-500";

  const filteredAndSortedTransactions = transactions
    .filter((t) =>
      (filterType === "all" || t.type === filterType) &&
      (filterCategory === "all" || t.category === filterCategory)
    )
    .sort((a, b) => {
      const valA = sortBy === "amount" ? a.amount : new Date(a.date).getTime();
      const valB = sortBy === "amount" ? b.amount : new Date(b.date).getTime();
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

  const totalCredit = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  if (transactions.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No transactions found</h3>
          <p className="text-gray-500">Start by adding your first transaction to track your finances.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</p>
            </div>
            <ArrowUp className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebit)}</p>
            </div>
            <ArrowDown className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${totalCredit - totalDebit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalCredit - totalDebit)}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${totalCredit - totalDebit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {totalCredit - totalDebit >= 0 ? '✓' : '✗'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>
            Transaction History ({filteredAndSortedTransactions.length} transactions)
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {transaction.type === 'credit' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${getCategoryColor(transaction.category)}`}></span>
                      {getCategoryName(transaction.category)}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button onClick={() => onEdit(transaction)} variant="outline" size="sm"> <Edit className="w-4 h-4" /></Button>
                      <Button onClick={() => transaction._id && onDelete(transaction._id)} variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
