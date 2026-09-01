import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { FARMING_METHODS } from "@/lib/farming-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import {
  TITHE_FARM_METHODS,
  FARMING_CONTRACT_METHODS,
  HESPORI_METHODS,
} from "@/lib/wiki-audit-activities";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function FarmingMethodsPanel({
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
      title="Farming methods"
      skillKey="farming"
      skillLabel="Farming"
      methods={FARMING_METHODS}
      activities={[
        ...activitiesForSkill("farming"),
        ...TITHE_FARM_METHODS,
        ...FARMING_CONTRACT_METHODS,
        ...HESPORI_METHODS,
      ]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
