import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { FISHING_METHODS } from "@/lib/fishing-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function FishingMethodsPanel({
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
      title="Fishing methods"
      skillKey="fishing"
      skillLabel="Fishing"
      description="Core fish, barbarian, karambwan, minnows, eels, Leechfin (high-intensity), and Drift net. Tempoross lives under Activities. Rates from wiki focused values."
      methods={FISHING_METHODS}
      activities={activitiesForSkill("fishing")}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
