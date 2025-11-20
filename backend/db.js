const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoUri);

let db;

async function connectDB() {
  if (db) {
    return db;
  }
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('appdb');
    return db;
  } catch (err) {
    console.warn('Could not connect to MongoDB:', err.message);
    throw err;
  }
}

function getDB() {
    if (!db) {
        throw new Error('Database not connected');
    }
    return db;
}

function isConnected() {
    return !!client && !!client.topology && client.topology.isConnected();
}

module.exports = { connectDB, getDB, isConnected };
