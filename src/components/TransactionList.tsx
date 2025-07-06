import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount (₹)</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString("en-IN")}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
                    transaction.amount
                  )}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2 border-emerald-600 text-emerald-700 hover:bg-emerald-100"
                    onClick={() => onEdit(transaction)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-500"
                    onClick={() => onDelete(transaction._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}