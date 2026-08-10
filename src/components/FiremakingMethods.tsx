import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { FIREMAKING_METHODS } from "@/lib/firemaking-methods";
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
  return (
    <SkillingMethodsPanel
      title="Firemaking methods"
      skillKey="firemaking"
      skillLabel="Firemaking"
      description="Log burning at GE rates (~1485 logs/hr). Wintertodt excluded — activity multi-reward structure."
      methods={FIREMAKING_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
