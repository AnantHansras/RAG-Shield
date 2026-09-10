# RAGShield — Frontend

Dark, minimal research-lab UI for RAGShield, a RAG poisoning defense
framework. Built with React + Vite + Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. The dev server proxies `/api/*` to
`http://localhost:8000` (see `vite.config.js`), so start the backend
too — see `../backend/README.md` — for the app to actually respond.

## Structure

```
src/
  api/
    chat.js         sendMessage()                → POST /api/chat
    attack.js       generatePoisonedDocuments()   → POST /api/attack/generate
                     injectPoisonedDocuments()     → POST /api/attack/inject
                     testAttackAgainstModel()      → POST /api/attack/test
    evaluate.js     evaluateSystem()              → POST /api/evaluate
  data/
    modes.js        the five RAG modes (only "normal" is enabled)
    mock.js         unused by the app now — kept as a reference for the
                     response shapes each endpoint returns as dummy data
  components/       FeatureCard, SourcesPanel, RetrievalList
  pages/            Home, Chatbot, Attack, SystemEvaluation
```

All four `src/api/*.js` files call the real backend directly — there's
no mock fallback baked into the app anymore. If the backend is down,
those calls will fail and reject their promise.

## Pages

- **Home** (`/`) — three feature cards: Chatbot, Attack, System Evaluation.
- **Chatbot** (`/chatbot`) — single-input ChatGPT-style chat with a
  "Defense" dropdown to pick one of the five RAG modes (only None
  is enabled; the rest show "Coming Soon").
- **Attack** (`/attack`) — Manual Entry or Upload File (.txt/.csv, one
  row per query) → Generate Poisoned Documents → review A1/A2 → Inject
  → Retrieval Impact → Test Against Chatbot.
- **System Evaluation** (`/system-evaluation`) — upload a .txt/.csv of
  queries (built for batches in the thousands) → Run Evaluation →
  F1 / Precision / Recall / ASR plus a per-query Correct/Incorrect table.

## Enabling a new defense mode

Edit `src/data/modes.js`: set the mode's `status` to `"available"`. It
will then be selectable in the Chatbot page's defense dropdown, the
System Evaluation defense dropdown, and the Attack page's "Test Against
Chatbot" list — no other frontend changes needed.
