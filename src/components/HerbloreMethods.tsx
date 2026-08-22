import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { HERBLORE_METHODS } from "@/lib/herblore-methods";
import { MIXOLOGY_METHODS } from "@/lib/mixology-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function HerbloreMethodsPanel({
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
      title="Herblore methods"
      skillKey="herblore"
      skillLabel="Herblore"
      methods={HERBLORE_METHODS}
      activities={MIXOLOGY_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
