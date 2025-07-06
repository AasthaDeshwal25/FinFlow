import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  if (db) {
    console.log("Reusing existing MongoDB connection");
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in environment variables");
    throw new Error("MONGODB_URI is not set");
  }

  const dbName = process.env.MONGODB_DB_NAME || "finflow";

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB successfully at", uri);
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}