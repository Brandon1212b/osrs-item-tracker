import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  Search,
  Shield,
  Pickaxe,
  Sword,
  Target,
  Sparkles,
  Package,
  HardHat,
  Shirt,
  Circle,
  Hand,
  Grip,
  CircleDot,
  Footprints,
  Gem,
  UtensilsCrossed,
  FlaskConical,
  Hammer,
  Scissors,
  Sprout,
} from "lucide-react";

import {
  CATALOG,
  GEAR_COMBAT_FILTERS,
  GEAR_SLOT_FILTERS,
  SKILLING_FILTERS,
  type CatalogItem,
} from "@/lib/osrs-catalog";
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

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sword,
  Target,
  Sparkles,
  Package,
  HardHat,
  Shirt,
  Circle,
  Hand,
  Grip,
  CircleDot,
  Footprints,
  Gem,
  Shield,
  UtensilsCrossed,
  FlaskConical,
  Hammer,
  Scissors,
  Sprout,
};

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
  const [gearCombat, setGearCombat] = useState<string>("all");
  const [gearSlot, setGearSlot] = useState<string>("all");
  const [skill, setSkill] = useState<string>("all");

  const rowsByName = useMemo(
    () => new Map((snapshot.data ?? []).map((r) => [r.name, r])),
    [snapshot.data],
  );

  const itemByName = useMemo(() => {
    const map = new Map<string, CatalogItem>();
    for (const g of CATALOG) {
      for (const i of g.items) {
        map.set(i.name, i);
      }
    }
    return map;
  }, []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter((g) => filter === "all" || filter === "deals" || g.kind === filter)
      .map((g) => ({
        ...g,
        rows: g.items
          .map((item) => rowsByName.get(item.name))
          .filter((r): r is NonNullable<typeof r> => !!r)
          .filter((r) => (q ? r.name.toLowerCase().includes(q) : true))
          .filter((r) => {
            if (filter !== "gear") return true;
            const tags = itemByName.get(r.name)?.tags ?? [];
            if (gearCombat !== "all" && !tags.includes(gearCombat)) return false;
            if (gearSlot !== "all" && !tags.includes(gearSlot)) return false;
            return true;
          })
          .filter((r) => {
            if (filter !== "skilling") return true;
            const tags = itemByName.get(r.name)?.tags ?? [];
            if (skill !== "all" && !tags.includes(skill)) return false;
            return true;
          })
          .filter((r) => (filter === "deals" ? signalOf(trends.data?.[r.id]).rank <= 1 : true))
          .sort(
            (a, b) =>
              signalOf(trends.data?.[a.id]).rank - signalOf(trends.data?.[b.id]).rank ||
              a.name.localeCompare(b.name),
          ),
      }))
      .filter((g) => g.rows.length > 0);
  }, [filter, query, rowsByName, trends.data, gearCombat, gearSlot, skill, itemByName]);

  const handleFilterChange = (next: Filter) => {
    setFilter(next);
    setGearCombat("all");
    setGearSlot("all");
    setSkill("all");
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-3 bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:flex-row sm:items-start sm:px-6">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Tab active={filter === "all"} onClick={() => handleFilterChange("all")} label="Everything" />
            <Tab
              active={filter === "gear"}
              onClick={() => handleFilterChange("gear")}
              label="Gear"
              icon={<Shield className="size-3.5" />}
            />
            <Tab
              active={filter === "skilling"}
              onClick={() => handleFilterChange("skilling")}
              label="Skilling"
              icon={<Pickaxe className="size-3.5" />}
            />
            <Tab active={filter === "deals"} onClick={() => handleFilterChange("deals")} label="Cheap now" />
          </div>

          {filter === "gear" && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                <SubTab active={gearCombat === "all"} onClick={() => setGearCombat("all")} label="All combat" />
                {GEAR_COMBAT_FILTERS.map((f) => (
                  <SubTab
                    key={f.key}
                    active={gearCombat === f.key}
                    onClick={() => setGearCombat(f.key)}
                    label={f.label}
                    icon={ICONS[f.icon]}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SubTab active={gearSlot === "all"} onClick={() => setGearSlot("all")} label="All items" />
                {GEAR_SLOT_FILTERS.map((f) => (
                  <SubTab
                    key={f.key}
                    active={gearSlot === f.key}
                    onClick={() => setGearSlot(f.key)}
                    label={f.label}
                    icon={ICONS[f.icon]}
                  />
                ))}
              </div>
            </div>
          )}

          {filter === "skilling" && (
            <div className="flex flex-wrap gap-1.5">
              <SubTab active={skill === "all"} onClick={() => setSkill("all")} label="All skills" />
              {SKILLING_FILTERS.map((f) => (
                <SubTab
                  key={f.key}
                  active={skill === f.key}
                  onClick={() => setSkill(f.key)}
                  label={f.label}
                  icon={ICONS[f.icon]}
                />
              ))}
            </div>
          )}
        </div>
        <div className="relative sm:w-72">
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

function SubTab({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? "border-primary/70 bg-primary/15 text-primary"
          : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
      }`}
    >
      {Icon && <Icon className="size-3" />}
      {label}
    </button>
  );
}
