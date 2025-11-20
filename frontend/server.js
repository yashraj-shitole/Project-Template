const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Frontend serving static files on port ${port}`);
});
