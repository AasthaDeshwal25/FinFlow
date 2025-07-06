import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Budget } from "@/types";

export async function GET() {
  try {
    const db = await connectDB();
    const budgets = await db.collection("budgets").find({}).toArray();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB();
    const data: Omit<Budget, "_id"> = await request.json();
    
    // Add timestamp
    const budgetData = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    const result = await db.collection("budgets").insertOne(budgetData);
    return NextResponse.json({ _id: result.insertedId, ...budgetData });
  } catch (error) {
    console.error("Error adding budget:", error);
    return NextResponse.json({ error: "Failed to add budget" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await connectDB();
    const { _id, ...data }: Budget = await request.json();
    
    // Update with timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    await db.collection("budgets").updateOne(
      { _id }, 
      { $set: updateData }
    );
    
    return NextResponse.json({ message: "Budget updated successfully" });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await connectDB();
    const { _id } = await request.json();
    
    const result = await db.collection("budgets").deleteOne({ _id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}