import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { THIEVING_METHODS } from "@/lib/thieving-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function ThievingMethodsPanel({
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
      title="Thieving methods"
      skillKey="thieving"
      skillLabel="Thieving"
      description="Stalls and pickpocketing. Most methods are pure XP (coin/loot not modelled as fixed GE output). Rates from wiki focused values."
      methods={THIEVING_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
