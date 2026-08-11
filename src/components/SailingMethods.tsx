import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { SAILING_METHODS } from "@/lib/sailing-methods";
import { SAILING_ACTIVITY_METHODS } from "@/lib/sailing-activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function SailingMethodsPanel({
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
      title="Sailing methods"
      skillKey="sailing"
      skillLabel="Sailing"
      description="Barracuda Trials (fastest XP), courier loops, sea charting, and AFK salvaging. Pure XP methods — cost is opportunity vs your gp/hr rate. Requires Pandemonium."
      methods={SAILING_METHODS}
      activities={SAILING_ACTIVITY_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
