import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const categories = await db.collection("categories").find({}).toArray();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB();
    const data = await request.json();
    const result = await db.collection("categories").insertOne(data);
    return NextResponse.json({ _id: result.insertedId, ...data });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}