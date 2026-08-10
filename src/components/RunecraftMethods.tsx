import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { RUNECRAFT_METHODS } from "@/lib/runecraft-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function RunecraftMethodsPanel({
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
      title="Runecraft methods"
      skillKey="runecraft"
      skillLabel="Runecraft"
      description="Abyss combination runes, Ourania/ZMI, standard altars and True Blood/Soul. GOTR excluded (activity rewards). Sorted by what each XP costs you."
      methods={RUNECRAFT_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
