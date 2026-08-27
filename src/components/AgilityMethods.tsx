import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { AGILITY_METHODS } from "@/lib/agility-methods";
import { SEPULCHRE_FLOOR_5 } from "@/lib/sepulchre-floor5";
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
      methods={AGILITY_METHODS.filter((m) => m.id !== "hallowed-sepulchre")}
      activities={[SEPULCHRE_FLOOR_5]}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
