import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Search, Shield, Pickaxe } from "lucide-react";

import { CATALOG } from "@/lib/osrs-catalog";
import { fetchSnapshot, fetchTrends } from "@/lib/osrs.functions";
import { ItemCard } from "@/components/ItemCard";
import { signalOf } from "@/lib/format";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GE Watch — OSRS Gear & Skilling Price Tracker" },
      {
        name: "description",
        content:
          "Live OSRS Grand Exchange prices for gear and skilling supplies, with 180-day buy signals so you know when an item is actually cheap.",
      },
      { property: "og:title", content: "GE Watch — OSRS Gear & Skilling Price Tracker" },
      {
        property: "og:description",
        content:
          "Live OSRS prices for gear upgrades and wiki-recommended skilling supplies, scored against their 180-day range.",
      },
    ],
  }),
  component: Home,
});

type Filter = "all" | "gear" | "skilling" | "deals";

function Home() {
  const snapshotFn = useServerFn(fetchSnapshot);
  const trendsFn = useServerFn(fetchTrends);

  const snapshot = useQuery({
    queryKey: ["osrs-snapshot"],
    queryFn: () => snapshotFn(),
    refetchInterval: 120_000,
  });
  const trends = useQuery({
    queryKey: ["osrs-trends"],
    queryFn: () => trendsFn(),
    staleTime: 30 * 60_000,
  });

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rowsByName = useMemo(
    () => new Map((snapshot.data ?? []).map((r) => [r.name, r])),
    [snapshot.data],
  );

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter((g) => filter === "all" || filter === "deals" || g.kind === filter)
      .map((g) => ({
        ...g,
        rows: g.items
          .map((name) => rowsByName.get(name))
          .filter((r): r is NonNullable<typeof r> => !!r)
          .filter((r) => (q ? r.name.toLowerCase().includes(q) : true))
          .filter((r) => (filter === "deals" ? signalOf(trends.data?.[r.id]).rank <= 1 : true))
          .sort(
            (a, b) =>
              signalOf(trends.data?.[a.id]).rank - signalOf(trends.data?.[b.id]).rank ||
              a.name.localeCompare(b.name),
          ),
      }))
      .filter((g) => g.rows.length > 0);
  }, [filter, query, rowsByName, trends.data]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-3 bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:flex-row sm:items-center sm:px-6">
        <div className="flex flex-wrap gap-2">
          <Tab active={filter === "all"} onClick={() => setFilter("all")} label="Everything" />
          <Tab
            active={filter === "gear"}
            onClick={() => setFilter("gear")}
            label="Gear"
            icon={<Shield className="size-3.5" />}
          />
          <Tab
            active={filter === "skilling"}
            onClick={() => setFilter("skilling")}
            label="Skilling"
            icon={<Pickaxe className="size-3.5" />}
          />
          <Tab active={filter === "deals"} onClick={() => setFilter("deals")} label="Cheap now" />
        </div>
        <div className="relative sm:ml-auto sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items…"
            className="pl-9"
          />
        </div>
      </div>

      {snapshot.isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="panel h-56 animate-pulse opacity-60" />
          ))}
        </div>
      )}

      {snapshot.isError && (
        <p className="mt-8 text-sm text-destructive">
          Couldn't reach the live price feed. Try refreshing in a moment.
        </p>
      )}

      {groups.map((group) => (
        <section key={group.id} className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-2">
            <h2 className="text-xl font-semibold">{group.label}</h2>
            <p className="text-xs text-muted-foreground">{group.note}</p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.rows.map((row) => (
              <ItemCard key={row.id} row={row} trend={trends.data?.[row.id]} />
            ))}
          </div>
        </section>
      ))}

      {!snapshot.isLoading && groups.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Nothing matches that filter right now.
        </p>
      )}

      <footer className="mt-16 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        Price data from the OSRS Wiki real-time Grand Exchange API. Not affiliated with Jagex.
      </footer>
    </main>
  );
}

function Tab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
