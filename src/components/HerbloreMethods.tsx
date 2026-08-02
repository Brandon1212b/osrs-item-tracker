import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { HERBLORE_METHODS } from "@/lib/herblore-methods";
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
  trendsById?: Record<number, Trend>;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null;
}) {
  return (
    <SkillingMethodsPanel
      title="Herblore methods"
      skillKey="herblore"
      skillLabel="Herblore"
      description="Prayer / super potions, super combat and cleaning herbs. ~2500 potions/h focused rates."
      methods={HERBLORE_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
