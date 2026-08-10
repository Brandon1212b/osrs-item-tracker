import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { CONSTRUCTION_METHODS } from "@/lib/construction-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function ConstructionMethodsPanel({
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
      title="Construction methods"
      skillKey="construction"
      skillLabel="Construction"
      description="POH furniture (planks consumed) plus Mahogany Homes. Sorted by what each XP costs you."
      methods={CONSTRUCTION_METHODS}
      activities={activitiesForSkill("construction")}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
