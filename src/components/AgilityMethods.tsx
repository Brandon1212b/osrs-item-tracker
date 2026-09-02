import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { AGILITY_METHODS } from "@/lib/agility-methods";
import { SEPULCHRE_FLOOR_5 } from "@/lib/sepulchre-floor5";
import { SEPULCHRE_FLOOR_4 } from "@/lib/sepulchre-floor4";
import {
  SEPULCHRE_ACTIVITY,
  WILDERNESS_AGILITY_ACTIVITY,
  BRIMHAVEN_AGILITY_ACTIVITY,
  AGILITY_PYRAMID_ACTIVITY,
} from "@/lib/wiki-audit-activities";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

const MOVED = new Set(["hallowed-sepulchre", "wilderness-agility"]);
const SEPULCHRE_REPLACED = new Set(["sepulchre-floor-5-loot", "sepulchre-floor-4"]);

export function AgilityMethodsPanel({
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
      title="Agility methods"
      skillKey="agility"
      skillLabel="Agility"
      methods={AGILITY_METHODS.filter((m) => !MOVED.has(m.id))}
      activities={[
        SEPULCHRE_FLOOR_5,
        SEPULCHRE_FLOOR_4,
        ...SEPULCHRE_ACTIVITY.filter((a) => !SEPULCHRE_REPLACED.has(a.id)),
        ...WILDERNESS_AGILITY_ACTIVITY,
        ...BRIMHAVEN_AGILITY_ACTIVITY,
        ...AGILITY_PYRAMID_ACTIVITY,
      ]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
