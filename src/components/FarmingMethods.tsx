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
      description="Herb runs, trees, fruit trees, hardwood and specialty patches. Tree/fruit APH reflects realistic run throughput. Sorted by what each XP costs you."
      methods={FARMING_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
