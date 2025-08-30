import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllDocs, getDocBySlug } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((d) => ({ id: d.slug }));
}

export default function DocDetail({ params }: { params: { id: string } }) {
  const doc = getDocBySlug(params.id);
  if (!doc) return notFound();

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <Link href="/docs" className="text-sm text-teal-700 underline">← Kembali ke semua artikel</Link>
      <h1 className="text-2xl font-semibold">{doc.title}</h1>
      <div className="text-sm text-slate-500">{doc.topics.join(" • ")} • {doc.minutes} min</div>
      <article className="prose max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
      </article>
    </main>
  );
}
