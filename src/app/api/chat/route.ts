// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { searchDocsServer } from "@/lib/search_server";
import type { Doc } from "@/lib/search_server";

// Jalankan di Node.js runtime
export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractQuestion(body: any): string {
  // dukung beberapa bentuk payload:
  if (body?.q) return String(body.q);
  if (body?.query) return String(body.query);
  if (Array.isArray(body?.messages) && body.messages.length) {
    // cari user message terakhir
    const lastUser =
      [...body.messages]
        .reverse()
        .find((m: any) => (m.role === "user" || m.role === "human") && (m.content || m.text)) ?? body.messages.at(-1);
    return String(lastUser?.content ?? lastUser?.text ?? "");
  }
  return "";
}

function buildContext(hits: Doc[]) {
  if (!hits.length) return "Tidak ada materi relevan yang ditemukan.";
  return hits
    .map(
      (d, i) =>
        `[${i + 1}] ${d.title} — Topics: ${d.topics.join(", ")} (±${d.minutes} min)
${d.content.slice(0, 1200)}`
    )
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const question = extractQuestion(body);

    // cari materi lokal
    const hits = searchDocsServer(question, 4);

    // siapkan prompt RAG
    const system =
      "Kamu adalah asisten untuk tim desain & prepress. Jawab singkat, jelas, dan berbasis materi yang diberikan. " +
      "Jika tidak yakin, bilang tidak yakin. Sertakan referensi dalam format [1], [2] sesuai daftar materi.";

    const context = buildContext(hits);
    const user =
      `Pertanyaan: ${question}\n\n` +
      `Materi terkait:\n${context}\n\n` +
      `Instruksi: Jawab dengan bahasa Indonesia yang natural, langkah-ringkas, dan tambahkan rujukan [n] pada kalimat yang bersumber dari materi.`

    // panggil OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ganti ke model lain bila perlu
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Maaf, saya tidak mendapatkan jawaban.";

    // siapkan sumber/rujukan untuk UI
    const sources = hits.map((d, i) => ({
      id: d.id,
      idx: i + 1,
      title: d.title,
      topics: d.topics,
      minutes: d.minutes,
    }));

    return NextResponse.json({ answer, sources });
  } catch (err: any) {
    console.error("API /chat error:", err);
    return NextResponse.json(
      { error: "Gagal memproses permintaan." },
      { status: 500 }
    );
  }
}
