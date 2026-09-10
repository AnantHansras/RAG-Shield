// Backend contract: POST /api/evaluate
// Body: { mode: string, queries: string[] }
// Response: { totalQueries, f1, precision, recall, asr, perQuery: [{ id, query, correct }] }
//
// Backed by backend/app/routers/evaluate.py. That controller validates
// real input (which may be a large batch parsed client-side from an
// uploaded .txt/.csv) but currently returns static dummy metrics — see
// its "TODO: BACKEND LOGIC" docstring for where real batch evaluation
// should go.
export async function evaluateSystem(payload) {
  const response = await fetch("/api/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Evaluation request failed: ${response.status}`);
  }

  return response.json();
}
