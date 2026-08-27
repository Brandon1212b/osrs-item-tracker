import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { WOODCUTTING_METHODS } from "@/lib/woodcutting-methods";
import { WOODCUTTING_RATE_TABLES } from "@/lib/woodcutting-activities";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function WoodcuttingMethodsPanel({
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
      title="Woodcutting methods"
      skillKey="woodcutting"
      skillLabel="Woodcutting"
      methods={WOODCUTTING_METHODS}
      activities={[...activitiesForSkill("woodcutting"), ...WOODCUTTING_RATE_TABLES]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
