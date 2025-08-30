"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import Link from "next/link";
import { searchDocs } from "@/lib/search";

type Msg = { role: "user" | "bot"; text?: string; jsx?: React.ReactNode };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hai! Tanyakan aturan desain apa pun. Aku akan mencari di materi portal." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs, open]);

  async function askServer(q: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
    });
    if (!res.ok) {
      // fallback lokal sederhana
      const hits = searchDocs(q, 3);
      if (!hits.length) return { text: "Belum ketemu artikel yang pas. Coba kata kunci lain (mis: rigid, checklist, color).", sources: [] };
      return {
        text: "Ringkasan cepat dari materi terkait:",
        sources: hits.map((h) => ({ id: h.id, title: h.title, topics: h.topics }))
      };
    }
    const data = await res.json();
    return { text: data.answer || data.text, sources: data.sources || data.hits || [] };
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    setText("");
    setMsgs((m) => [...m, { role: "user", text: q }]);

    // indikator singkat
    setMsgs((m) => [...m, { role: "bot", text: "Sebentar… saya cek materi terkait." }]);

    try {
      const { text, sources } = await askServer(q);

      // hapus indikator
      setMsgs((m) => m.slice(0, -1));

      // jawaban utama (teks)
      setMsgs((m) => [...m, { role: "bot", text }]);

      // rujukan klik-able (JSX)
      const jsx =
        sources && sources.length ? (
          <div className="mt-2 text-xs">
            <div className="mb-1 font-medium">Rujukan:</div>
            <ul className="list-disc space-y-0.5 pl-5">
              {sources.map((s: any, i: number) => (
                <li key={i}>
                  <Link href={`/docs/${s.id}`} className="text-teal-700 underline">
                    {s.title}
                  </Link>{" "}
                  <span className="text-slate-500">({Array.isArray(s.topics) ? s.topics.join(" • ") : ""})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-2 text-xs text-slate-500">Tidak ada rujukan yang sangat relevan.</div>
        );

      setMsgs((m) => [...m, { role: "bot", jsx }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Jaringan bermasalah. Coba lagi ya." }]);
    }
  }

  // hints kecil dari pencarian lokal
  const hints = text.length >= 2 ? searchDocs(text, 3).map((d) => d.title) : [];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-teal-600 px-4 py-3 text-white shadow-lg hover:bg-teal-700"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Chat</span>
        </button>
      )}

      {open && (
        <div className="flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b px-3 py-2 dark:border-slate-700">
            <div className="font-medium">Asisten Portal</div>
            <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-auto p-3 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div
                  className={
                    "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 " +
                    (m.role === "user"
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100")
                  }
                >
                  {m.text}
                  {m.jsx}
                </div>
              </div>
            ))}
          </div>

          {hints.length > 0 && (
            <div className="mx-3 mb-2 text-xs text-slate-500">Terkait: {hints.join(" • ")}</div>
          )}

          <form onSubmit={send} className="flex items-center gap-2 border-t p-2 dark:border-slate-700">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tanya aturan / keyword…"
              className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900"
            />
            <button type="submit" className="inline-flex h-10 items-center justify-center rounded-lg bg-teal-600 px-3 text-white hover:bg-teal-700">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
