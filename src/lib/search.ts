import { docs, type Doc } from "./knowledge";

export function searchDocs(q: string, k = 3): (Doc & { score: number; snippet: string })[] {
  const qq = q.toLowerCase();
  const scored = docs.map((d) => {
    const hay = (d.title + " " + d.topics.join(" ") + " " + d.content).toLowerCase();
    const score =
      (hay.includes(qq) ? 3 : 0) +
      qq.split(/[\\s,-]+/).reduce((acc, w) => (w && hay.includes(w) ? acc + 1 : acc), 0);
    // snippet sederhana
    const idx = hay.indexOf(qq);
    const snippet =
      idx >= 0 ? d.content.slice(Math.max(0, idx - 30), Math.min(d.content.length, idx + 120)) : d.content.slice(0, 150);
    return { ...d, score, snippet };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
