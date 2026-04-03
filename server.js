/**
 * Portfolio Intelligence — Anthropic Proxy Server
 * ------------------------------------------------
 * Sits between your browser and api.anthropic.com.
 * Holds your API key safely on the server side.
 * 
 * Run locally:  node server.js
 * Deploy free:  Railway / Render / Fly.io
 */

const express  = require('express');
const cors     = require('cors');
const fetch    = require('node-fetch');
const path     = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────
app.use(cors());               // Allow browser requests from any origin
app.use(express.json({ limit: '2mb' }));

// Serve the portfolio HTML at the root URL
app.use(express.static(path.join(__dirname, 'public')));

// ── Health check ────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── Anthropic proxy endpoint ─────────────────────────────
// Browser POSTs here → server adds the real API key → forwards to Anthropic
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'ANTHROPIC_API_KEY not set in .env file. See README.' }
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta':    'web-search-2025-03-05'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // Forward Anthropic's status code and response
    res.status(response.status).json(data);

  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).json({
      error: { message: 'Proxy fetch failed: ' + err.message }
    });
  }
});

// ── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Portfolio Intelligence proxy running`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/health`);
  console.log(`   API:     http://localhost:${PORT}/api/claude\n`);
});
