import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";
import type { ActivityMethod } from "@/lib/activity-methods";
export type { MethodPart, SkillingMethod, RankedMethod } from "@/components/skilling-types";
import type { SkillingMethod } from "@/components/skilling-types";

/**
 * Temporary stub — full panel (category dropdown + no description blurb) will follow.
 * Skill-level description props are already removed from all *Methods wrappers.
 */
export function SkillingMethodsPanel({
  title,
}: {
  title: string;
  skillKey: string;
  skillLabel: string;
  methods: SkillingMethod[];
  activities?: ActivityMethod[];
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">
        Methods panel is being restored. Description clutter under each skill is already gone.
      </p>
    </section>
  );
}
