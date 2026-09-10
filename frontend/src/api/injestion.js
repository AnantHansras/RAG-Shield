export async function injectDocuments() {
  const response = await fetch("/api/inject", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Injection request failed: ${response.status}`);
  }

  return response.json();
}