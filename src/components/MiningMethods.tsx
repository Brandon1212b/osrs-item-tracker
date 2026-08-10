import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { MINING_METHODS } from "@/lib/mining-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

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
      description="Ores, Motherlode Mine, Volcanic Mine, Blast Mine, and Shooting Stars. Sorted by what each XP costs you."
      methods={MINING_METHODS}
      activities={activitiesForSkill("mining")}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
