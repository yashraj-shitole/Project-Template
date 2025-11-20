const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';

let dbClient;

async function start() {
  try {
    dbClient = new MongoClient(mongoUri);
    await dbClient.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('Could not connect to MongoDB at startup:', err.message);
  }

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/items', async (req, res) => {
    try {
      if (!dbClient || !dbClient.topology || !dbClient.topology.isConnected()) {
        // try reconnect
        await dbClient.connect();
      }
      const db = dbClient.db('appdb');
      const items = await db.collection('items').find().toArray();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/items', express.json(), async (req, res) => {
    try {
      const db = dbClient.db('appdb');
      const doc = req.body || {};
      const result = await db.collection('items').insertOne(doc);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
