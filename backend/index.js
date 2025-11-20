const express = require('express');
const { connectDB } = require('./db');
const routes = require('./routes');
const errorHandler = require('./errorHandler');

const app = express();
const port = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('Could not connect to MongoDB at startup:', err.message);
    process.exit(1);
  }

  app.use('/', routes);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
