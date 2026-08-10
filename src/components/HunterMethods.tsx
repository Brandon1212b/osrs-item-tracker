import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { HUNTER_METHODS } from "@/lib/hunter-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function HunterMethodsPanel({
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
      title="Hunter methods"
      skillKey="hunter"
      skillLabel="Hunter"
      description="Chinchompas, birdhouse runs (effective rates), and Herbiboar. Birdhouse nest loot can be expanded later. Sorted by what each XP costs you."
      methods={HUNTER_METHODS}
      activities={activitiesForSkill("hunter")}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
