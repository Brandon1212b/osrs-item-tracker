import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { FARMING_METHODS } from "@/lib/farming-methods";
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
  trendsById?: Record<number, Trend>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null;
}) {
  return (
    <SkillingMethodsPanel
      title="Farming methods"
      skillKey="farming"
      skillLabel="Farming"
      description="Herb runs modelled with average ~7 yield. Seed cost vs grimy herb value. Sorted by your cost per XP."
      methods={FARMING_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
