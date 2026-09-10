// All three functions are backed by backend/app/routers/attack.py.
// That controller validates real input but currently returns static
// poisoning generation / injection / defense evaluation should go.

// Backend contract: POST /api/attack/generate
// Body: { records: [{ targetQuery, correctAnswer, incorrectAnswer }] }
//   A single manual entry is sent as a one-item array so the backend
//   always deals with a batch, whether it came from the form or a
//   .txt/.csv upload.
// Response: { results: [{ targetQuery, correctAnswer, incorrectAnswer, a1, a2 }] }
export async function generatePoisonedDocuments(records) {
  const response = await fetch("/api/attack/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records }),
  });

  if (!response.ok) {
    throw new Error(`Generation request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

// Backend contract: POST /api/attack/inject
// Body: { records: [{ targetQuery, correctAnswer, incorrectAnswer, a1, a2 }] }
// Response: { results: [{ targetQuery, before: [...], after: [...], enteredTopK }] }
export async function injectPoisonedDocuments(records) {
  const response = await fetch("/api/attack/inject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records }),
  });

  if (!response.ok) {
    throw new Error(`Injection request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

