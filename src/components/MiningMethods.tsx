import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { MINING_METHODS } from "@/lib/mining-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function MiningMethodsPanel({
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
      title="Mining methods"
      skillKey="mining"
      skillLabel="Mining"
      description="Ores and specialty rocks. Rates from wiki focused values. Activity methods (MLM, Volcanic/Blast Mine) excluded — multi-output rewards."
      methods={MINING_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
