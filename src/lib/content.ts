import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type DocMeta = {
  id: string;
  title: string;
  topics: string[];
  minutes: number;
  slug: string; // sama dengan nama file
};

export type Doc = DocMeta & { content: string };

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

function readFile(slug: string) {
  const full = path.join(DOCS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  const meta = {
    id: String(data.id ?? slug),
    title: String(data.title ?? slug),
    topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
    minutes: Number(data.minutes ?? 3),
    slug,
  };
  return { meta, content } as { meta: DocMeta; content: string };
}

export function listSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllDocs(): Doc[] {
  return listSlugs().map((slug) => {
    const { meta, content } = readFile(slug);
    return { ...meta, content };
  });
}

export function getDocBySlug(slug: string): Doc | null {
  const file = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { meta, content } = readFile(slug);
  return { ...meta, content };
}
