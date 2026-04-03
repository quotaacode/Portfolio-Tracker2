const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY || '';
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    keySet: !!key,
    keyLength: key.length,
    keyPrefix: key.slice(0, 16) + '...'
  });
});

app.post('/api/claude', async (req, res) => {
  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'ANTHROPIC_API_KEY not set in Railway Variables tab.' }
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    console.log('Anthropic response status:', response.status);
    res.status(response.status).json(data);

  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: { message: 'Proxy error: ' + err.message } });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  const key = process.env.ANTHROPIC_API_KEY || '';
  console.log('API Key set:', !!key, '| Length:', key.length, '| Prefix:', key.slice(0,16)+'...');
});
