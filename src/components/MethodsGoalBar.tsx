import { useEffect, useState } from "react";
import { xpForLevel, clampSkillLevel, xpRemainingToLevel, MAX_SKILL_LEVEL } from "@/lib/osrs-xp";

export type MethodsMetricView = "rate" | "goal";

const VIEW_KEY = "ge-watch-methods-metric";
const TARGET_KEY = "ge-watch-methods-target-level";

function readStoredView(): MethodsMetricView {
  try {
    return localStorage.getItem(VIEW_KEY) === "goal" ? "goal" : "rate";
  } catch {
    return "rate";
  }
}

function readStoredTarget(): number {
  try {
    const n = Number(localStorage.getItem(TARGET_KEY));
    if (Number.isFinite(n)) return clampSkillLevel(n, 2, MAX_SKILL_LEVEL);
  } catch {
    /* private mode */
  }
  return 99;
}

export function useMethodsGoal(hiscoreLevel?: number, hiscoreXp?: number) {
  const [view, setView] = useState<MethodsMetricView>("rate");
  const [targetLevel, setTargetLevel] = useState<number>(99);
  const [manualLevel, setManualLevel] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setView(readStoredView());
    setTargetLevel(readStoredTarget());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* private mode */
    }
  }, [view, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(TARGET_KEY, String(targetLevel));
    } catch {
      /* private mode */
    }
  }, [targetLevel, hydrated]);

  // New hiscores load replaces a previous manual override.
  useEffect(() => {
    setManualLevel(null);
  }, [hiscoreLevel, hiscoreXp]);

  const currentLevel = manualLevel ?? (hiscoreLevel != null ? clampSkillLevel(hiscoreLevel) : 1);
  const usingExactXp = manualLevel == null && hiscoreXp != null && Number.isFinite(hiscoreXp);
  const currentXp = usingExactXp ? Math.max(0, hiscoreXp!) : xpForLevel(currentLevel);
  const xpRemaining = xpRemainingToLevel(currentXp, targetLevel);

  return {
    view,
    setView,
    targetLevel,
    setTargetLevel: (n: number) => setTargetLevel(clampSkillLevel(n, 2, MAX_SKILL_LEVEL)),
    currentLevel,
    setCurrentLevel: (n: number) => setManualLevel(clampSkillLevel(n, 1, MAX_SKILL_LEVEL)),
    currentXp,
    xpRemaining,
    usingExactXp,
  };
}

export function MethodsGoalBar({
  view,
  onViewChange,
  currentLevel,
  onCurrentLevelChange,
  targetLevel,
  onTargetLevelChange,
  skillLabel,
}: {
  view: MethodsMetricView;
  onViewChange: (v: MethodsMetricView) => void;
  currentLevel: number;
  onCurrentLevelChange: (n: number) => void;
  targetLevel: number;
  onTargetLevelChange: (n: number) => void;
  skillLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex h-8 items-center rounded-full border border-border/60 bg-secondary/30 p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("rate")}
            className={`h-7 rounded-full px-3 text-[11px] font-medium ${
              view === "rate" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            XP/h
          </button>
          <button
            type="button"
            onClick={() => onViewChange("goal")}
            className={`h-7 rounded-full px-3 text-[11px] font-medium ${
              view === "goal" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            To {targetLevel}
          </button>
        </div>

        <label className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-2.5 text-[11px] text-muted-foreground">
          Now
          <input
            type="number"
            min={1}
            max={99}
            inputMode="numeric"
            value={currentLevel}
            onChange={(e) => onCurrentLevelChange(Number(e.target.value))}
            className="h-6 w-10 rounded-md border border-border/50 bg-background px-1 text-center text-xs font-semibold tabular-nums text-foreground"
            aria-label={`Current ${skillLabel} level`}
          />
        </label>

        <label className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-2.5 text-[11px] text-muted-foreground">
          Target
          <input
            type="number"
            min={2}
            max={99}
            inputMode="numeric"
            value={targetLevel}
            onChange={(e) => onTargetLevelChange(Number(e.target.value))}
            className="h-6 w-10 rounded-md border border-border/50 bg-background px-1 text-center text-xs font-semibold tabular-nums text-foreground"
            aria-label="Target skill level"
          />
        </label>
      </div>

    </div>
  );
}
