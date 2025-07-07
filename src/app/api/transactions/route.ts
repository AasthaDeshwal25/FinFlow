import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// === GLOBAL CACHED CLIENT ===
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri);
  const db = client.db('finflow');

  cachedClient = client;
  cachedDb = db;

  return db;
}

// === GET: Fetch All Transactions ===
export async function GET() {
  try {
    const db = await connectToDatabase();
    const transactions = await db
      .collection('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// === POST: Add a Transaction ===
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { description, amount, category, type, date } = data;

    if (!description || !amount || !category || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['credit', 'debit'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    const db = await connectToDatabase();

    const transaction = {
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('transactions').insertOne(transaction);

    return NextResponse.json({
      success: true,
      message: 'Transaction added',
      transaction: { ...transaction, _id: result.insertedId }
    });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// === PUT: Update Transaction ===
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data._id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();

    const updated = {
      ...(data.description && { description: data.description }),
      ...(data.amount && { amount: parseFloat(data.amount) }),
      ...(data.category && { category: data.category }),
      ...(data.type && { type: data.type }),
      ...(data.date && { date: new Date(data.date) }),
      updatedAt: new Date()
    };

    const result = await db.collection('transactions').updateOne(
      { _id: new ObjectId(data._id) },
      { $set: updated }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction updated'
    });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// === DELETE: Delete Transaction ===
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data._id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();

    const result = await db.collection('transactions').deleteOne({
      _id: new ObjectId(data._id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted'
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
