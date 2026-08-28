import { SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { GEAR_COMBAT_FILTERS } from "@/lib/osrs-catalog";
import type { RangeKey } from "@/lib/osrs.server";

type Filter = "all" | "gear" | "skilling" | "supplies";
type SortKey = "gainers" | "losers" | "expensive" | "cheap" | "value";

const CATEGORIES: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "gear", label: "Gear" },
  { key: "skilling", label: "Skilling items" },
  { key: "supplies", label: "Supplies" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "gainers", label: "Gainers" },
  { key: "losers", label: "Losers" },
  { key: "expensive", label: "Expensive" },
  { key: "cheap", label: "Cheap" },
  { key: "value", label: "Best value" },
];

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "1d", label: "24h" },
  { key: "1w", label: "1w" },
  { key: "1m", label: "1m" },
  { key: "3m", label: "3m" },
  { key: "6m", label: "6m" },
  { key: "1y", label: "1y" },
];

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export function HomeFiltersButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open filters"
      title="Filters"
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-secondary/40 text-foreground hover:bg-secondary/60 ${className}`}
    >
      <SlidersHorizontal className="size-4" />
    </button>
  );
}

export function HomeFiltersSheet({
  open,
  onOpenChange,
  filter,
  gearCombat,
  sort,
  range,
  onFilterChange,
  onCombatChange,
  onSortChange,
  onRangeChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: Filter;
  gearCombat: string;
  sort: SortKey;
  range: RangeKey;
  onFilterChange: (next: Filter) => void;
  onCombatChange: (next: string) => void;
  onSortChange: (next: SortKey) => void;
  onRangeChange: (next: RangeKey) => void;
}) {
  const combatLabel =
    filter === "gear" && gearCombat !== "all"
      ? GEAR_COMBAT_FILTERS.find((c) => c.key === gearCombat)?.label
      : null;
  const categoryLabel = combatLabel ?? CATEGORIES.find((c) => c.key === filter)?.label ?? "All";
  const sortLabel = SORTS.find((s) => s.key === sort)?.label ?? "Sort";
  const rangeLabel = RANGES.find((r) => r.key === range)?.label ?? range;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="pointer-events-auto mx-auto flex h-11 w-full max-w-md items-center justify-center gap-2 rounded-full border border-border/70 bg-background/95 px-4 text-sm font-medium text-foreground shadow-lg backdrop-blur hover:bg-secondary/60"
        >
          <SlidersHorizontal className="size-4 shrink-0" />
          <span>Filters</span>
          <span className="text-muted-foreground">·</span>
          <span className="truncate text-muted-foreground">
            {categoryLabel} · {sortLabel} · {rangeLabel}
          </span>
        </button>
      </div>
      <DrawerContent className="mx-auto max-w-lg">
        <DrawerHeader className="pb-1 text-left">
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <section className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.key}
                  active={filter === c.key && (c.key !== "gear" || gearCombat === "all")}
                  onClick={() => {
                    onFilterChange(c.key);
                    onCombatChange("all");
                  }}
                  label={c.label}
                />
              ))}
            </div>
            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Gear style</p>
            <div className="flex flex-wrap gap-1.5">
              {GEAR_COMBAT_FILTERS.map((c) => (
                <Chip
                  key={c.key}
                  active={filter === "gear" && gearCombat === c.key}
                  onClick={() => {
                    onFilterChange("gear");
                    onCombatChange(gearCombat === c.key ? "all" : c.key);
                  }}
                  label={c.label}
                />
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Sort</p>
            <div className="flex flex-wrap gap-1.5">
              {SORTS.map((s) => (
                <Chip key={s.key} active={sort === s.key} onClick={() => onSortChange(s.key)} label={s.label} />
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Range</p>
            <div className="flex flex-wrap gap-1.5">
              {RANGES.map((r) => (
                <Chip key={r.key} active={range === r.key} onClick={() => onRangeChange(r.key)} label={r.label} />
              ))}
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
