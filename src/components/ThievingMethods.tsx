import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { THIEVING_METHODS } from "@/lib/thieving-methods";
import { THIEVING_RATE_TABLES } from "@/lib/thieving-activities";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

const MOVED = new Set([
  "blackjacking",
  "ardougne-knights",
  "elves",
  "vyres",
  "master-farmers",
]);

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
      methods={THIEVING_METHODS.filter((m) => !MOVED.has(m.id))}
      activities={[
        ...activitiesForSkill("thieving").filter((a) => a.id !== "pyramid-plunder"),
        ...THIEVING_RATE_TABLES,
      ]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
