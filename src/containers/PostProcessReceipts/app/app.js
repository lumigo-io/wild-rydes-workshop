const express = require('express');
const app = express();
const opentelemetry = require('@opentelemetry/api')

app.get('/health', async (req, res) => {
  // Opt out of reporting spans for successful calls to the health endpoint
  const span = opentelemetry.trace.getSpan();
  if (span) {
    span.spanContext().traceFlags = 0;
  }

  res.send('OK');
});

app.put('/api/receipts', async (req, res) => {
  console.log(`Received receipt: ${req.body}`);
  const r = Math.random();
  if (r * 100 < 50) {
    res.send('OK');
  } else {
    res.status(500).send('BORKED');
  }
});

app.listen((process.env.SERVER_PORT || 5000), '0.0.0.0');
