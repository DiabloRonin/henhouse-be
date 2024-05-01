const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const cluster = process.env.DB_CLUSTER;

// MongoDB Connection
const mongoURI = `mongodb+srv://${username}:${password}@crudify.usixfr1.mongodb.net/?retryWrites=true&w=majority&appName=crudify`
const dbName = 'crudify'; // Set the name of the database

// Create a new MongoClient
const client = new MongoClient(mongoURI);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection('henhouses');

    // Seed Data
    const seedData = [
      { chickenCount: 30, temperature: 22.5, humidity: 45, timestamp: new Date() },
      { chickenCount: 32, temperature: 23.0, humidity: 47, timestamp: new Date() },
      { chickenCount: 34, temperature: 21.0, humidity: 50, timestamp: new Date() },
      { chickenCount: 33, temperature: 22.0, humidity: 48, timestamp: new Date() },
      { chickenCount: 31, temperature: 24.0, humidity: 46, timestamp: new Date() }
    ];

    // Insert seed data into the collection
    const insertResult = await collection.insertMany(seedData);
    console.log(`${insertResult.insertedCount} documents were inserted`);
  } catch (err) {
    console.error("Failed to insert seed data:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
