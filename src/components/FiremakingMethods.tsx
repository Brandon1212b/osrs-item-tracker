import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { ActivityMethodsSection } from "@/components/ActivityMethodsSection";
import { FIREMAKING_METHODS } from "@/lib/firemaking-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function FiremakingMethodsPanel({
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
  const activities = activitiesForSkill("firemaking");

  return (
    <div>
      <SkillingMethodsPanel
        title="Firemaking methods"
        skillKey="firemaking"
        skillLabel="Firemaking"
        description="Log burning at GE rates (~1485 logs/hr). Activity methods (Wintertodt) listed below."
        methods={FIREMAKING_METHODS}
        rowsByName={rowsByName}
        trendsById={trendsById}
        moneyPerHour={moneyPerHour}
        onMoneyPerHourChange={onMoneyPerHourChange}
        playerSkills={playerSkills}
      />
      <ActivityMethodsSection
        methods={activities}
        skillKey="firemaking"
        skillLabel="Firemaking"
        rowsByName={rowsByName}
        moneyPerHour={moneyPerHour}
        playerSkills={playerSkills}
      />
    </div>
  );
}
