// src/data/categories.ts
export interface Category {
  id: string;
  name: string;
  color: string;
}

export const categories: Category[] = [
  { id: "food", name: "Food", color: "bg-red-500" },
  { id: "rent", name: "Rent", color: "bg-blue-500" },
  { id: "entertainment", name: "Entertainment", color: "bg-green-500" },
  { id: "utilities", name: "Utilities", color: "bg-yellow-500" },
  { id: "other", name: "Other", color: "bg-gray-500" },
];
