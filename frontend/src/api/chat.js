// Backend contract: POST /api/chat
// Body: { message: string, mode: string }
// Response: { id, role, content, sources: [{ id, name, path, score }] }
//
// Backed by backend/app/routers/chat.py. That controller validates real
// input but currently returns static dummy data — see its
// "TODO: BACKEND LOGIC" docstring for where real retrieval + generation
// should go.
export async function sendMessage(message, mode = "normal") {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, mode }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  return response.json();
}
