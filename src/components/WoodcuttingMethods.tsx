import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { WOODCUTTING_METHODS } from "@/lib/woodcutting-methods";
import { WOODCUTTING_RATE_TABLES } from "@/lib/woodcutting-activities";
import { FORESTRY_METHODS } from "@/lib/wiki-audit-activities";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

const MOVED = new Set([
  "teak-logs",
  "sulliusceps",
  "blisterwood",
  "ironwood-logs",
  "redwood-logs",
  "rosewood-logs",
  "bloodwood",
]);

export function WoodcuttingMethodsPanel({
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
      title="Woodcutting methods"
      skillKey="woodcutting"
      skillLabel="Woodcutting"
      methods={WOODCUTTING_METHODS.filter((m) => !MOVED.has(m.id))}
      activities={[...WOODCUTTING_RATE_TABLES, ...FORESTRY_METHODS]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
