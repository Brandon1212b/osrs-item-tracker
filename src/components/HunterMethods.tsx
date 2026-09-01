import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { HUNTER_METHODS } from "@/lib/hunter-methods";
import { HUNTER_RATE_TABLES } from "@/lib/hunter-activities";
import { HUNTER_RUMOUR_METHODS, IMPLING_METHODS } from "@/lib/wiki-audit-activities";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function HunterMethodsPanel({
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
      title="Hunter methods"
      skillKey="hunter"
      skillLabel="Hunter"
      methods={HUNTER_METHODS.filter((m) => !["red-chins", "black-chins"].includes(m.id))}
      activities={[...HUNTER_RATE_TABLES, ...HUNTER_RUMOUR_METHODS, ...IMPLING_METHODS]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
