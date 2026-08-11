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
      description="Barracuda Trials (fastest XP), courier loops, sea charting, and AFK salvaging. Salvage gp/hr tracks live GE on major loot; residual EV covers coins/rares. Requires Pandemonium."
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
