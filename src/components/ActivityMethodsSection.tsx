import { useMemo } from "react";
import type { PriceRow } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";
import type { ActivityMethod } from "@/lib/activity-methods";
import { gp, compactNum, formatCost } from "@/lib/format";

function buyPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.high ?? row.low ?? null;
}

function sellPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.low ?? row.high ?? null;
}

function effectiveGpPerXp(
  xpPerHour: number,
  gpPerHour: number,
  moneyPerHour: number,
): number | null {
  if (xpPerHour <= 0 || moneyPerHour <= 0) return null;
  return Math.round(((moneyPerHour - gpPerHour) / xpPerHour) * 10) / 10;
}

type RankedActivity = {
  method: ActivityMethod;
  xpPerHour: number;
  gpPerHour: number | null;
  costPerXp: number | null;
  locked: boolean;
  missing: boolean;
};

/**
 * Compact list of activity methods ranked with the same cost-per-XP score
 * as production methods, so users can compare Wintertodt vs log burning.
 */
export function ActivityMethodsSection({
  methods,
  skillLabel,
  skillKey,
  rowsByName,
  moneyPerHour,
  playerSkills,
}: {
  methods: ActivityMethod[];
  skillLabel: string;
  skillKey: string;
  rowsByName: Map<string, PriceRow>;
  moneyPerHour: number;
  playerSkills?: PlayerSkills | null | undefined;
}) {
  const skillLevel = playerSkills?.[skillKey];

  const ranked = useMemo(() => {
    const list: RankedActivity[] = methods.map((method) => {
      let consumableCost = 0;
      let missing = false;

      for (const part of method.consumables) {
        const p = buyPrice(rowsByName.get(part.name));
        if (p == null) {
          missing = true;
          break;
        }
        consumableCost += p * part.qty;
      }

      let rewardValue = method.expectedLootGpPerHour ?? 0;
      if (!missing) {
        for (const r of method.rewards) {
          const unit = sellPrice(rowsByName.get(r.name));
          if (unit == null) {
            missing = true;
            break;
          }
          rewardValue += unit * r.expectedQtyPerHour;
        }
      }

      const gpPerHour = missing ? null : Math.round(rewardValue - consumableCost);
      const costPerXp =
        gpPerHour == null
          ? null
          : effectiveGpPerXp(method.xpPerHour, gpPerHour, moneyPerHour);

      const locked = skillLevel != null && skillLevel < method.level;

      return {
        method,
        xpPerHour: method.xpPerHour,
        gpPerHour,
        costPerXp,
        locked,
        missing,
      };
    });

    return list.sort((a, b) => {
      if (skillLevel != null && a.locked !== b.locked) return a.locked ? 1 : -1;
      // Prefer lower cost-per-XP (same as production default)
      if (a.costPerXp != null && b.costPerXp != null) return a.costPerXp - b.costPerXp;
      if (a.costPerXp == null) return 1;
      if (b.costPerXp == null) return -1;
      return a.method.level - b.method.level;
    });
  }, [methods, rowsByName, moneyPerHour, skillLevel]);

  if (methods.length === 0) return null;

  return (
    <div className="mt-6 space-y-2">
      <div className="px-1">
        <h3 className="text-sm font-semibold text-foreground">Activity methods</h3>
        <p className="text-xs text-muted-foreground">
          Multi-reward / points-based. GP/h uses expected loot value (not a single GE output).
          Ranked with the same cost-per-XP score as production methods.
        </p>
      </div>

      {ranked.map((r, i) => (
        <article
          key={r.method.id}
          className={`panel flex flex-col gap-2 p-3 sm:p-3.5 ${r.locked ? "opacity-45" : ""}`}
          title={r.locked ? `Requires ${skillLabel} ${r.method.level}` : undefined}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground">
                  A{i + 1}
                </span>
                <h4 className="text-sm font-semibold leading-tight">{r.method.label}</h4>
                {r.method.intensity && (
                  <span className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {r.method.intensity}
                  </span>
                )}
              </div>
              <p
                className={`mt-0.5 text-[11px] ${
                  r.locked ? "font-semibold text-amber-500/90" : "text-muted-foreground"
                }`}
              >
                Lvl {r.method.level}
                {r.locked ? " · locked" : ""}
                {r.method.secondaryXp &&
                  ` · +${compactNum(Math.round(r.method.secondaryXp.xpPerHour))} ${r.method.secondaryXp.skill} XP/h`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-right text-xs tabular-nums">
              <div className="min-w-[4.5rem]">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">XP/h</div>
                <div className="font-semibold">{compactNum(Math.round(r.xpPerHour))}</div>
              </div>
              <div className="min-w-[4.5rem]">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">GP/h</div>
                <div
                  className="font-semibold"
                  style={{
                    color:
                      r.gpPerHour == null
                        ? undefined
                        : r.gpPerHour >= 0
                          ? "var(--deal)"
                          : "var(--steep)",
                  }}
                >
                  {r.gpPerHour == null
                    ? "—"
                    : `${r.gpPerHour > 0 ? "+" : ""}${gp(r.gpPerHour)}`}
                </div>
              </div>
              <div className="min-w-[4.5rem]" title="Supplies + opportunity cost per XP. Lower is better.">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Your cost</div>
                <div className="text-sm font-semibold text-foreground">
                  {r.costPerXp == null ? "—" : `${formatCost(r.costPerXp)} gp/xp`}
                </div>
              </div>
            </div>
          </div>

          {r.method.notes && (
            <p className="text-[11px] text-muted-foreground">{r.method.notes}</p>
          )}

          {r.missing && (
            <p className="text-[11px] text-muted-foreground">(missing price data for consumables/rewards)</p>
          )}
        </article>
      ))}
    </div>
  );
}
