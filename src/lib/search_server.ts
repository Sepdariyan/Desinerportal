// src/lib/search_server.ts
import { docs } from "./knowledge";

export type Doc = {
  id: string;
  title: string;
  topics: string[];
  minutes: number;
  content: string;
};

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pencarian super ringan di server.
 * Skor sederhana: kecocokan di judul > konten.
 */
export function searchDocsServer(query: string, limit = 4): Doc[] {
  const q = norm(query || "");
  if (!q) return [];

  const terms = q.split(" ").filter(Boolean);
  const scored = docs
    .map((d) => {
      const hayTitle = norm(d.title + " " + d.topics.join(" "));
      const hayAll = norm(d.title + " " + d.topics.join(" ") + " " + d.content);
      let score = 0;

      for (const t of terms) {
        if (hayAll.includes(t)) score += 2; // kecocokan umum
        if (hayTitle.includes(t)) score += 3; // booster judul/topik
      }
      return { doc: d, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.doc);

  return scored;
}
