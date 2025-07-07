import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finflow';
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('finflow');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// GET - Fetch all budgets
export async function GET() {
  try {
    const db = await connectToDatabase();
    const budgets = await db
      .collection('budgets')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      budgets: budgets
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

// POST - Create new budget
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.category || !data.amount) {
      return NextResponse.json(
        { error: 'Missing required fields: category and amount' },
        { status: 400 }
      );
    }

    // Validate amount
    if (parseFloat(data.amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    // Check if budget already exists for this category
    const existingBudget = await db.collection('budgets').findOne({
      category: data.category
    });

    if (existingBudget) {
      // Update existing budget
      const result = await db.collection('budgets').updateOne(
        { category: data.category },
        { 
          $set: {
            amount: parseFloat(data.amount),
            period: data.period || 'monthly',
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Budget updated successfully',
        updated: true
      });
    } else {
      // Create new budget
      const budget = {
        category: data.category,
        amount: parseFloat(data.amount),
        period: data.period || 'monthly',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('budgets').insertOne(budget);
      
      return NextResponse.json({
        success: true,
        message: 'Budget created successfully',
        budget: { ...budget, _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error creating/updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create/update budget' },
      { status: 500 }
    );
  }
}

// PUT - Update budget
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { error: 'Budget ID is required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (data.amount && parseFloat(data.amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    const updateData = {
      category: data.category,
      amount: parseFloat(data.amount),
      period: data.period || 'monthly',
      updatedAt: new Date()
    };

    const result = await db.collection('budgets').updateOne(
      { _id: new ObjectId(data._id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Budget updated successfully'
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

// DELETE - Delete budget
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { error: 'Budget ID is required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    const result = await db.collection('budgets').deleteOne({
      _id: new ObjectId(data._id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}