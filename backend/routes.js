const express = require('express');
const { getDB, isConnected } = require('./db');

const router = express.Router();

router.get('/live', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/ready', (req, res) => {
    if (isConnected()) {
        res.json({ status: 'ok' });
    } else {
        res.status(503).json({ status: 'unavailable' });
    }
});

router.get('/items', async (req, res, next) => {
  try {
    const db = getDB();
    const items = await db.collection('items').find().toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/items', express.json(), async (req, res, next) => {
  try {
    const db = getDB();
    const doc = req.body || {};
    const result = await db.collection('items').insertOne(doc);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
