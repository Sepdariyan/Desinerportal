// src/app/docs/[id]/page.tsx
import Link from "next/link";
import { docs } from "@/lib/knowledge";

// (opsional) pre-generate semua halaman docs
export function generateStaticParams() {
  return docs.map((d) => ({ id: d.id }));
}

// Perhatikan: params sekarang bertipe Promise<{ id: string }>
export default async function DocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const d = docs.find((x) => x.id === id);
  if (!d) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p className="text-sm opacity-70">
          Tidak ditemukan. <Link href="/">Kembali</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8 prose">
      <p className="text-sm"><Link href="/">← Kembali</Link></p>
      <h1>{d.title}</h1>
      <p className="text-sm opacity-70">
        {d.topics.join(", ")} • {d.minutes} min
      </p>
      <div className="mt-6 whitespace-pre-wrap">{d.content}</div>
    </main>
  );
}
