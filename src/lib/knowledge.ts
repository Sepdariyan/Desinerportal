// src/lib/knowledge.ts
export type Doc = {
  id: string;
  title: string;
  topics: string[];
  minutes: number;
  priority?: "P1" | "P2" | "P3";
  publishedAt?: string; // ISO date
  views?: number;
  content: string;
};

export const docs: Doc[] = [
  {
    id: "rigid-panel-bd",
    title: "Rigid Box — Panel B & D +3 mm (W side)",
    topics: ["Rigid Box", "Prepress"],
    minutes: 6,
    priority: "P1",
    publishedAt: "2025-08-01",
    views: 210,
    content:
      "Aturan panel sisi W untuk rigid box: tambahkan +3 mm pada panel B dan D agar toleransi lipatan terpenuhi...",
  },
  {
    id: "export-vendor-checklist",
    title: "Export Vendor — PDF/AI/PNG checklist",
    topics: ["Handover", "Checklist"],
    minutes: 4,
    priority: "P2",
    publishedAt: "2025-07-26",
    views: 155,
    content:
      "Checklist final sebelum kirim file ke vendor: format PDF/X, outline font, embed profile, bleed & slug...",
  },
  {
    id: "color-swatch-digital-press",
    title: "Color Swatch — Digital Press standard",
    topics: ["Color", "QA"],
    minutes: 5,
    priority: "P2",
    publishedAt: "2025-07-22",
    views: 122,
    content:
      "Gunakan swatch standar CMYK pada digital press. Hindari spot kecuali disetujui brand. DeltaE target < 2.5...",
  },
  {
    id: "knife-line-spec",
    title: "Knife line spec — stroke 1 pt, no dashed",
    topics: ["Prepress"],
    minutes: 4,
    priority: "P2",
    publishedAt: "2025-08-05",
    views: 98,
    content:
      "Pisau/die line wajib stroke 1 pt, warna magenta, non-dashed. Gunakan layer terpisah dan lock sebelum export...",
  },
  {
    id: "gap-guiding-3cm",
    title: "Gap guiding 3 cm — layout guidance",
    topics: ["Rigid Box"],
    minutes: 6,
    priority: "P2",
    publishedAt: "2025-08-03",
    views: 86,
    content:
      "Jarak guiding minimal 3 cm dari tepi panel untuk mencegah slip saat laminasi. Periksa arah serat board...",
  },
  {
    id: "overhang-lid-5mm",
    title: "Overhang lid +5 mm — validation",
    topics: ["Rigid Box", "QA"],
    minutes: 3,
    priority: "P2",
    publishedAt: "2025-07-28",
    views: 140,
    content:
      "Overhang tutup disarankan +5 mm dibanding base untuk feel premium. Cek konsistensi pada sample produksi...",
  },
  {
    id: "file-naming-vendor",
    title: "Vendor package — file naming",
    topics: ["Handover"],
    minutes: 4,
    priority: "P3",
    publishedAt: "2025-08-02",
    views: 77,
    content:
      "Penamaan file: {Brand}_{Project}_{Part}_{Size}_{Rev}.pdf. Simpan juga AI/packaged untuk revisi cepat...",
  },
  {
    id: "label-bleed-safe",
    title: "Label format — bleed & safe area",
    topics: ["Label"],
    minutes: 5,
    priority: "P2",
    publishedAt: "2025-07-30",
    views: 132,
    content:
      "Bleed minimal 3 mm, safe area 3 mm dari tepi potong. Hindari teks kecil <6 pt pada bahan bertekstur...",
  },
  {
    id: "templates-dieline-db",
    title: "Template linking — dielines DB",
    topics: ["Templates"],
    minutes: 4,
    priority: "P3",
    publishedAt: "2025-07-25",
    views: 65,
    content:
      "Gunakan tautan template dieline terpusat untuk mengurangi versi ganda. Selalu cek revisi terakhir (v2.3+)...",
  },
];
