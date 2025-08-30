// src/app/page.tsx
import { Bell, Flame, Search, Clock, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { docs } from "@/lib/knowledge";

// --- helper: placeholder cover ---
function Cover({ ratio = "16/9" }: { ratio?: "16/9" | "4/3" | "1/1" }) {
  const ratioClass = ratio === "16/9" ? "aspect-[16/9]" : ratio === "4/3" ? "aspect-[4/3]" : "aspect-square";
  return (
    <div className={`relative w-full ${ratioClass} overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-600`}>
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_10%,_white_0%,_transparent_40%),radial-gradient(circle_at_80%_70%,_#22d3ee_0%,_transparent_35%)]" />
      <div className="absolute inset-0 flex items-end p-3">
        <div className="text-xs text-white/80">cover preview</div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-slate-600 dark:text-slate-200 border-slate-200/60 dark:border-slate-700/80 bg-white/60 dark:bg-slate-800/60 backdrop-blur">
      {children}
    </span>
  );
}

function Meta({ minutes = 5, isNew = false }: { minutes?: number; isNew?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <Clock className="h-3.5 w-3.5" />
      <span>{minutes} min</span>
      {isNew && (
        <Badge className="h-5 rounded-full px-2 text-[10px]" variant="secondary">
          NEW
        </Badge>
      )}
    </div>
  );
}

function RuleCard({
  title,
  topics,
  minutes = 5,
  isNew = false,
  ratio = "4/3" as "4/3" | "16/9" | "1/1",
  priority = "P2",
}: {
  title: string;
  topics: string[];
  minutes?: number;
  isNew?: boolean;
  ratio?: "4/3" | "16/9" | "1/1";
  priority?: "P1" | "P2" | "P3";
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Cover ratio={ratio} />
          <div className="absolute left-2 top-2 flex gap-2">
            <Badge className="rounded-full px-2 py-0.5 text-[10px]" variant={priority === "P1" ? "destructive" : "secondary"}>
              {priority}
            </Badge>
          </div>
        </div>
        <div className="p-3 pt-2">
          <h3 className="line-clamp-2 font-semibold leading-snug text-slate-800 dark:text-slate-100">{title}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topics.map((t, i) => (
              <Chip key={i}>{t}</Chip>
            ))}
          </div>
          <div className="mt-2">
            <Meta minutes={minutes} isNew={isNew} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== derived data from docs =====
const featured = docs.filter((d) => d.priority === "P1").slice(0, 3);
const latest = [...docs]
  .sort(
    (a, b) =>
      new Date(b.publishedAt || "1970-01-01").getTime() - new Date(a.publishedAt || "1970-01-01").getTime()
  )
  .slice(0, 6);
const trending = [...docs]
  .sort((a, b) => (b.views || 0) - (a.views || 0))
  .slice(0, 8)
  .map((d) => d.title);

function groupTopics(docsArr: typeof docs) {
  const by: Record<string, { name: string; items: string[] }> = {};
  docsArr.forEach((d) =>
    d.topics.forEach((t) => {
      if (!by[t]) by[t] = { name: t, items: [] };
      if (by[t].items.length < 6) by[t].items.push(d.title);
    })
  );
  // ambil 4 topik pertama saja untuk layout
  return Object.values(by).slice(0, 4).map((x) => ({ name: x.name, items: x.items.slice(0, 3) }));
}
const topics = groupTopics(docs);

const updates = [
  { title: "Update: Rigid Box A—B produksi minggu ini", priority: "High" },
  { title: "Vendor board cut-off Jumat 17:00", priority: "Medium" },
  { title: "Template dieline v2.3 rilis", priority: "Low" },
];

export default function RulesPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-teal-500" />
            <span>Designer Rules Portal</span>
          </div>
          <div className="ml-auto flex w-full max-w-md items-center gap-2">
            <div className="relative w-full">
              <Input placeholder="Cari rule, topics, stage…" className="pl-9" />
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Announcement strip */}
      <div className="border-b bg-amber-50/70 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <Bell className="h-4 w-4" /> Production Updates
          </div>
          <div className="flex flex-1 items-center gap-6 overflow-auto whitespace-nowrap">
            {updates.map((u, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-flex h-5 items-center rounded-full bg-amber-500/20 px-2 text-[11px] font-medium">
                  {u.priority}
                </span>
                <span className="opacity-90">{u.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-10">
        {/* Featured / Headline */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured</h2>
            <a className="group inline-flex items-center text-sm text-teal-600 hover:underline" href="#">
              View all <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              {featured[0] && (
                <RuleCard
                  title={featured[0].title}
                  topics={featured[0].topics}
                  minutes={featured[0].minutes}
                  isNew={true}
                  ratio="16/9"
                  priority={featured[0].priority || "P2"}
                />
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {featured.slice(1, 3).map((d) => (
                <RuleCard
                  key={d.id}
                  title={d.title}
                  topics={d.topics}
                  minutes={d.minutes}
                  priority={d.priority || "P2"}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Latest */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((d) => (
              <RuleCard key={d.id} title={d.title} topics={d.topics} minutes={d.minutes} priority={d.priority || "P2"} />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Flame className="h-5 w-5 text-rose-500" /> Trending
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((t, i) => (
              <RuleCard key={i} title={t} topics={["Popular"]} minutes={4 + (i % 3)} />
            ))}
          </div>
        </section>

        {/* Topics / Categories */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Topics</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topics.map((col, i) => (
              <div key={i} className="rounded-2xl border bg-white/60 p-4 dark:bg-slate-900/40">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">{col.name}</h3>
                  <a href="#" className="text-sm text-teal-600 hover:underline">
                    See all
                  </a>
                </div>
                <div className="space-y-3">
                  {col.items.map((it, j) => (
                    <div key={j} className="group flex items-start gap-3 rounded-xl border p-3 hover:border-teal-300">
                      <div className="mt-1 h-8 w-8 shrink-0 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="flex-1">
                        <div className="line-clamp-2 text-sm font-medium group-hover:text-teal-700 dark:group-hover:text-teal-300">
                          {it}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{col.name} • 4 min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/60 py-8 dark:bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Studio</div>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">
                Tentang
              </a>
              <a href="#" className="hover:underline">
                Panduan Style
              </a>
              <a href="#" className="hover:underline">
                Hubungi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
