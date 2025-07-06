import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // Ensure this matches the exported function
import { Transaction } from "@/types";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const transactions = await db.collection<Transaction>("transactions").find({}).toArray();
    // Return transactions in the expected format
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB();
    const data: Omit<Transaction, "_id"> = await request.json();
    const result = await db.collection<Transaction>("transactions").insertOne(data);
    const transaction = await db
      .collection<Transaction>("transactions")
      .findOne({ _id: result.insertedId });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "Failed to add transaction", details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await connectDB();
    const { _id, ...data }: Transaction = await request.json();
    if (!_id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }
    await db
      .collection<Transaction>("transactions")
      .updateOne({ _id: new ObjectId(_id) }, { $set: data });
    const updatedTransaction = await db
      .collection<Transaction>("transactions")
      .findOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ message: "Transaction updated", transaction: updatedTransaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Failed to update transaction", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await connectDB();
    const { _id } = await request.json();
    if (!_id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }
    const result = await db
      .collection<Transaction>("transactions")
      .deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Failed to delete transaction", details: error.message }, { status: 500 });
  }
}