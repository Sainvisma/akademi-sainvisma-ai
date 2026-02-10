// services/geminiService.ts
// FRONTEND ONLY — TIDAK ADA SDK GEMINI DI SINI

export async function generateWithServer(prompt: string) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Gagal memanggil server AI');
  }

  const data = await res.json();
  return data.result;
}
