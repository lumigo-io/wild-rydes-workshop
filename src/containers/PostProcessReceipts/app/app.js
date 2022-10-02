const express = require('express');
const app = express();

app.get('/health', async (req, res) => {
  res.send('OK');
});

app.put('/api/receipts', async (req, res) => {
  console.log(`Received receipt: ${req.body}`);
  res.status(500).send('BORKED');
});

app.listen((process.env.SERVER_PORT || 5000), '0.0.0.0');
