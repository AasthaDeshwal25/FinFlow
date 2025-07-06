import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/types";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const transactions = await db.collection<Transaction>("transactions").find({}).toArray();
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch transactions", details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB();
    const data: Omit<Transaction, "_id"> = await request.json();

    const result = await db.collection<Transaction>("transactions").insertOne({
      ...data,
      date: new Date().toISOString(), // Optional: add timestamp
    });

    const transaction = await db
      .collection<Transaction>("transactions")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to add transaction", details: message },
      { status: 500 }
    );
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
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...data, updatedAt: new Date().toISOString() } }
      );

    const updatedTransaction = await db
      .collection<Transaction>("transactions")
      .findOne({ _id: new ObjectId(_id) });

    return NextResponse.json({ message: "Transaction updated", transaction: updatedTransaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update transaction", details: message },
      { status: 500 }
    );
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete transaction", details: message },
      { status: 500 }
    );
  }
}
