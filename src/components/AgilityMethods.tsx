import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { AGILITY_METHODS } from "@/lib/agility-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function AgilityMethodsPanel({
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
      title="Agility methods"
      skillKey="agility"
      skillLabel="Agility"
      description="Rooftop courses and Hallowed Sepulchre. Pure XP methods — cost is opportunity + stamina supplies."
      methods={AGILITY_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
