import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { MINING_METHODS } from "@/lib/mining-methods";
import { MINING_RATE_TABLES } from "@/lib/mining-activities";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

const MOVED = new Set(["iron-ore", "gem-rock", "granite-3tick", "amethyst"]);

export function MiningMethodsPanel({
  rowsByName,
  trendsById,
  moneyPerHour,
  onMoneyPerHourChange,
  playerSkills,
}: {
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend> | undefined;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null | undefined;
}) {
  return (
    <SkillingMethodsPanel
      title="Mining methods"
      skillKey="mining"
      skillLabel="Mining"
      methods={MINING_METHODS.filter((m) => !MOVED.has(m.id))}
      activities={[...activitiesForSkill("mining"), ...MINING_RATE_TABLES]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
