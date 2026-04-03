# Portfolio Intelligence 1.0
### Netscape Navigator Edition 📊

---

## Why a server?
Browsers block direct calls to the Anthropic API (CORS policy), and API keys can't
be stored safely in a webpage. This tiny server sits between your browser and
Anthropic — it holds your API key securely and relays requests.

---

## Setup — 3 options

---

### Option A: Run locally on your computer (fastest)

**Requirements:** Node.js 16+ — download free at https://nodejs.org

```bash
# 1. Unzip this folder, open a terminal inside it, then:

# 2. Install dependencies (one time only)
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Open .env in any text editor and paste your API key:
#    ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
#    Get your key at: https://console.anthropic.com

# 5. Start the server
npm start

# 6. Open your browser to:
#    http://localhost:3000
```

That's it. The portfolio tracker is live at http://localhost:3000.
It runs entirely on your machine. Stop it with Ctrl+C.

**Auto-start on login (optional):**
```bash
# Mac/Linux — add to your shell profile:
cd /path/to/portfolio-server && npm start &
```

---

### Option B: Deploy free to Railway (access from anywhere, Notion embed)

Railway gives you a public URL you can embed in Notion.

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
   - Push this folder to a GitHub repo first, or use Railway's file upload
3. In Railway dashboard → your project → **Variables** tab:
   - Add: `ANTHROPIC_API_KEY` = `sk-ant-api03-your-key-here`
4. Railway auto-deploys. You'll get a URL like `https://portfolio-xxx.railway.app`
5. In Notion: type `/embed` → paste that URL

Free tier: 500 hours/month (enough for always-on if you keep it active)

---

### Option C: Deploy free to Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo (or upload files)
3. Settings:
   - Build command: `npm install`
   - Start command: `npm start`
4. Environment Variables → Add: `ANTHROPIC_API_KEY` = your key
5. Deploy → get your public URL
6. Embed in Notion with `/embed`

---

## Getting your Anthropic API key

1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** in the left sidebar
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-api03-...`)
6. Paste it in your `.env` file

New accounts get free credits. Usage is very low — a full analysis costs ~$0.01.

---

## Project structure

```
portfolio-server/
├── server.js          ← The proxy server (don't need to edit this)
├── package.json       ← Dependencies
├── .env.example       ← Copy to .env and add your key
├── .env               ← YOUR KEY LIVES HERE (never commit to git)
├── .gitignore         ← Keeps .env out of git
└── public/
    └── index.html     ← The full portfolio tracker app
```

---

## Embed in Notion

Once deployed (Railway/Render):
1. Open any Notion page
2. Type `/embed`
3. Paste your deployed URL
4. Resize the embed block to full width
5. Done — your live portfolio dashboard is in Notion

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module 'express'` | Run `npm install` first |
| `ANTHROPIC_API_KEY not set` | Check your `.env` file exists and has the key |
| `401 authentication_error` | Your API key is wrong or expired — get a new one |
| `502 Bad Gateway` | Anthropic API is down — retry in a minute |
| Port 3000 already in use | Edit `.env` and add `PORT=3001`, then visit localhost:3001 |

---

## Security notes

- Your API key is **only** in the `.env` file on your server — never in the browser
- The `.gitignore` prevents `.env` from being committed to git
- For personal use this is fine; for a team, add authentication to server.js
