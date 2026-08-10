import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, type ComponentType } from "react";
import { Loader2, User, X } from "lucide-react";
import { z } from "zod";

import { useMarketData } from "@/hooks/useMarketData";
import { usePlayerLookup } from "@/hooks/usePlayerLookup";
import { CraftingMethodsPanel } from "@/components/CraftingMethods";
import { ConstructionMethodsPanel } from "@/components/ConstructionMethods";
import { PrayerMethodsPanel } from "@/components/PrayerMethods";
import { SmithingMethodsPanel } from "@/components/SmithingMethods";
import { MagicMethodsPanel } from "@/components/MagicMethods";
import { RunecraftMethodsPanel } from "@/components/RunecraftMethods";
import { FarmingMethodsPanel } from "@/components/FarmingMethods";
import { FletchingMethodsPanel } from "@/components/FletchingMethods";
import { CookingMethodsPanel } from "@/components/CookingMethods";
import { AgilityMethodsPanel } from "@/components/AgilityMethods";
import { HerbloreMethodsPanel } from "@/components/HerbloreMethods";
import { MiningMethodsPanel } from "@/components/MiningMethods";
import { FishingMethodsPanel } from "@/components/FishingMethods";
import { WoodcuttingMethodsPanel } from "@/components/WoodcuttingMethods";
import { FiremakingMethodsPanel } from "@/components/FiremakingMethods";
import { ThievingMethodsPanel } from "@/components/ThievingMethods";
import { HunterMethodsPanel } from "@/components/HunterMethods";
import { WikiImage } from "@/components/WikiImage";
import { Input } from "@/components/ui/input";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

const DEFAULT_G = 2_000_000;

const methodsSearchSchema = z.object({
  skill: z.string().catch(""),
  g: z.coerce.number().catch(DEFAULT_G),
});

export type MethodsSearch = z.infer<typeof methodsSearchSchema>;

type MethodsPanelProps = {
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend> | undefined;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null | undefined;
};

/** One-line config: add a new skill's Methods panel here later. */
const METHOD_SKILLS: {
  key: string;
  label: string;
  wikiIcon: string;
  Panel: ComponentType<MethodsPanelProps>;
}[] = [
  {
    key: "herblore",
    label: "Herblore",
    wikiIcon: "Herblore_icon.png",
    Panel: HerbloreMethodsPanel,
  },
  {
    key: "construction",
    label: "Construction",
    wikiIcon: "Construction_icon.png",
    Panel: ConstructionMethodsPanel,
  },
  { key: "prayer", label: "Prayer", wikiIcon: "Prayer_icon.png", Panel: PrayerMethodsPanel },
  {
    key: "crafting",
    label: "Crafting",
    wikiIcon: "Crafting_icon.png",
    Panel: CraftingMethodsPanel,
  },
  {
    key: "smithing",
    label: "Smithing",
    wikiIcon: "Smithing_icon.png",
    Panel: SmithingMethodsPanel,
  },
  { key: "magic", label: "Magic", wikiIcon: "Magic_icon.png", Panel: MagicMethodsPanel },
  {
    key: "runecraft",
    label: "Runecraft",
    wikiIcon: "Runecraft_icon.png",
    Panel: RunecraftMethodsPanel,
  },
  { key: "farming", label: "Farming", wikiIcon: "Farming_icon.png", Panel: FarmingMethodsPanel },
  {
    key: "fletching",
    label: "Fletching",
    wikiIcon: "Fletching_icon.png",
    Panel: FletchingMethodsPanel,
  },
  { key: "cooking", label: "Cooking", wikiIcon: "Cooking_icon.png", Panel: CookingMethodsPanel },
  { key: "agility", label: "Agility", wikiIcon: "Agility_icon.png", Panel: AgilityMethodsPanel },
  { key: "mining", label: "Mining", wikiIcon: "Mining_icon.png", Panel: MiningMethodsPanel },
  { key: "fishing", label: "Fishing", wikiIcon: "Fishing_icon.png", Panel: FishingMethodsPanel },
  {
    key: "woodcutting",
    label: "Woodcutting",
    wikiIcon: "Woodcutting_icon.png",
    Panel: WoodcuttingMethodsPanel,
  },
  {
    key: "firemaking",
    label: "Firemaking",
    wikiIcon: "Firemaking_icon.png",
    Panel: FiremakingMethodsPanel,
  },
  { key: "thieving", label: "Thieving", wikiIcon: "Thieving_icon.png", Panel: ThievingMethodsPanel },
  { key: "hunter", label: "Hunter", wikiIcon: "Hunter_icon.png", Panel: HunterMethodsPanel },
];

export const Route = createFileRoute("/methods")({
  validateSearch: (search: Record<string, unknown>): MethodsSearch =>
    methodsSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Skilling Methods — GE Watch" },
      {
        name: "description",
        content:
          "OSRS skilling training method guides with live Grand Exchange prices, XP/hr, GP/hr, and personalised cost scores.",
      },
      { property: "og:title", content: "Skilling Methods — GE Watch" },
      {
        property: "og:description",
        content:
          "Compare OSRS training methods for Crafting, Construction, Prayer, Smithing, and more — scored against live GE prices.",
      },
    ],
  }),
  component: MethodsPage,
});

function MethodsPage() {
  const navigate = useNavigate({ from: "/methods" });
  const search = Route.useSearch();
  const { skill, g } = search;
  const moneyPerHour = Number.isFinite(g) && g > 0 ? g : DEFAULT_G;

  const { snapshot, trends } = useMarketData("6m");
  const { rsnDraft, setRsnDraft, activeRsn, playerQuery, playerSkills, loadRsn, clearRsn } =
    usePlayerLookup();

  const rowsByName = useMemo(
    () => new Map((snapshot.data ?? []).map((r) => [r.name, r])),
    [snapshot.data],
  );

  const selected = METHOD_SKILLS.find((s) => s.key === skill) ?? null;
  const SelectedPanel = selected?.Panel;

  const patchSearch = (patch: Partial<MethodsSearch>) => {
    void navigate({
      search: (prev: MethodsSearch) => {
        const next = { ...prev, ...patch };
        const cleaned: Partial<MethodsSearch> = {};
        if (next.skill) cleaned.skill = next.skill;
        if (next.g && next.g !== DEFAULT_G) cleaned.g = next.g;
        return cleaned as MethodsSearch;
      },
      replace: true,
    });
  };

  const skillBarEntries = useMemo(() => {
    if (!playerSkills) return [];
    const keys = selected ? [selected.key] : METHOD_SKILLS.map((s) => s.key);
    return keys
      .map((key) => {
        const level = playerSkills[key];
        if (level == null) return null;
        const meta = METHOD_SKILLS.find((s) => s.key === key);
        return {
          key,
          icon: meta?.wikiIcon ?? `${key}_icon.png`,
          label: meta?.label ?? key,
          level,
        };
      })
      .filter((s): s is NonNullable<typeof s> => s != null);
  }, [playerSkills, selected]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="sticky top-0 z-30 -mx-4 flex flex-col gap-3 border-b border-border/40 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:flex-row sm:items-start sm:justify-between sm:px-6 pointer-events-auto isolate">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-semibold tracking-wide text-foreground sm:text-xl">
            Skilling Methods
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Training guides with live GE prices and personalised cost scores.
          </p>
        </div>

        <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[12rem]">
          <form
            className="flex items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              loadRsn(rsnDraft);
            }}
          >
            <div className="relative min-w-0 flex-1 sm:w-36">
              <User className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={rsnDraft}
                onChange={(e) => setRsnDraft(e.target.value)}
                placeholder="RSN"
                className="h-9 pl-8 pr-7 text-xs"
                aria-label="RuneScape name"
              />
              {activeRsn && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear player"
                  onClick={clearRsn}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!rsnDraft.trim() || playerQuery.isFetching}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/60 px-2.5 text-xs font-semibold transition-colors hover:bg-secondary disabled:opacity-50"
            >
              {playerQuery.isFetching ? <Loader2 className="size-3.5 animate-spin" /> : "Load"}
            </button>
          </form>
          {playerQuery.isError && (
            <p className="text-[11px] text-destructive">
              {(playerQuery.error as Error)?.message ?? "Lookup failed"}
            </p>
          )}
          {playerSkills && skillBarEntries.length > 0 && (
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-[10px] font-medium text-muted-foreground">
                {playerQuery.data?.name ?? activeRsn}
              </p>
              <div
                className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5"
                title={skillBarEntries.map((s) => `${s.label} ${s.level}`).join(" · ")}
              >
                {skillBarEntries.map((s) => (
                  <span
                    key={s.key}
                    className="inline-flex items-center gap-0.5 tabular-nums text-[11px] text-muted-foreground"
                    title={`${s.label} ${s.level}`}
                  >
                    <WikiImage
                      icon={s.icon}
                      alt=""
                      width={14}
                      height={14}
                      lazy={false}
                      className="size-3.5 shrink-0"
                      draggable={false}
                    />
                    <span className="font-semibold text-foreground/90">{s.level}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {METHOD_SKILLS.map((s) => (
          <WikiIconTab
            key={s.key}
            active={skill === s.key}
            onClick={() => patchSearch({ skill: skill === s.key ? "" : s.key })}
            label={s.label}
            wikiIcon={s.wikiIcon}
          />
        ))}
      </div>

      {snapshot.isLoading && (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading prices…
        </div>
      )}

      {snapshot.isError && (
        <p className="mt-8 text-center text-sm text-destructive">
          Couldn't reach the live price feed. Try refreshing in a moment.
        </p>
      )}

      {!snapshot.isLoading && !SelectedPanel && (
        <div className="mt-10 rounded-lg border border-dashed border-border/60 bg-secondary/20 px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">Pick a skill</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a skill icon above to view training methods ranked by cost and XP.
          </p>
        </div>
      )}

      {!snapshot.isLoading && SelectedPanel && (
        <SelectedPanel
          rowsByName={rowsByName}
          trendsById={trends.data}
          moneyPerHour={moneyPerHour}
          onMoneyPerHourChange={(n) => patchSearch({ g: n })}
          playerSkills={playerSkills}
        />
      )}
    </main>
  );
}

function WikiIconTab({
  active,
  onClick,
  label,
  wikiIcon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  wikiIcon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex size-8 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-primary/70 bg-primary/15 ring-1 ring-primary/40"
          : "border-border/60 bg-secondary/30 hover:bg-secondary/50"
      }`}
    >
      <WikiImage
        icon={wikiIcon}
        alt=""
        width={20}
        height={20}
        lazy={false}
        className="size-5"
        draggable={false}
      />
    </button>
  );
}
