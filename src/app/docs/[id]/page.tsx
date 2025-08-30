import Link from "next/link";
import { notFound } from "next/navigation";
// Kalau kamu belum punya data asli, import ini boleh dihapus.
// Pastikan file ini ada. Kalau belum, abaikan import dan adjust di bawah.
import { docs } from "@/lib/knowledge";

type Params = { id: string };

function getDocById(id: string) {
  try {
    // Jika kamu punya DB/array docs, akses di sini.
    // Sesuaikan field id/slug sesuai data kamu.
    return (docs ?? []).find((d: any) => d.id === id || d.slug === id) ?? null;
  } catch {
    return null;
  }
}

export default function DocPage({ params }: { params: Params }) {
  const { id } = params; // TIDAK pakai await di sini

  const doc = getDocById(id);

  if (!doc) {
    // Kalau tidak ketemu, tampilkan fallback yang rapi
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Dokumen tidak ditemukan</h1>
        <p className="mt-2 text-slate-500">ID: {id}</p>
        <Link href="/" className="text-teal-600 underline mt-4 inline-block">
          ← Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <article className="prose dark:prose-invert mx-auto p-6">
      <h1>{doc.title}</h1>
      {doc.topics?.length ? (
        <p className="text-sm text-slate-500">{doc.topics.join(" • ")}</p>
      ) : null}
      <div className="mt-6 whitespace-pre-wrap">
        {doc.content ?? "Belum ada konten."}
      </div>
    </article>
  );
}

// Opsional: supaya SSG bisa generate halaman detail (aman walau docs kosong)
export function generateStaticParams() {
  try {
    return (docs ?? []).map((d: any) => ({ id: d.id }));
  } catch {
    return [];
  }
}
