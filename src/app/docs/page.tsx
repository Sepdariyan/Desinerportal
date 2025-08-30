import Link from "next/link";
import { getAllDocs } from "@/lib/content";

export const dynamic = "force-static"; // boleh juga "auto"

export default function DocsIndex() {
  const docs = getAllDocs();
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Semua Artikel</h1>
      <ul className="space-y-3">
        {docs.map((d) => (
          <li key={d.slug} className="rounded-xl border bg-white/60 p-4 dark:bg-slate-900/40">
            <div className="text-lg font-medium">{d.title}</div>
            <div className="mt-1 text-sm text-slate-500">
              {d.topics.join(" • ")} • {d.minutes} min
            </div>
            <p className="mt-2 text-slate-700 dark:text-slate-200">{d.content.slice(0, 160)}...</p>
            <Link href={`/docs/${d.slug}`} className="mt-3 inline-block text-teal-700 underline">
              Buka artikel →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
