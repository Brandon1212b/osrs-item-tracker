import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { xpForLevel, clampSkillLevel, xpRemainingToLevel, MAX_SKILL_LEVEL } from "@/lib/osrs-xp";

export type MethodsMetricView = "rate" | "goal";

const VIEW_KEY = "ge-watch-methods-metric";

function readStoredView(): MethodsMetricView {
  try {
    return localStorage.getItem(VIEW_KEY) === "goal" ? "goal" : "rate";
  } catch {
    return "rate";
  }
}

export function useMethodsGoal(hiscoreLevel?: number, hiscoreXp?: number) {
  const [view, setView] = useState<MethodsMetricView>("rate");
  const [targetLevel, setTargetLevelState] = useState<number>(2);
  const [manualLevel, setManualLevel] = useState<number | null>(null);
  const [targetTouched, setTargetTouched] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setView(readStoredView());
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

  // New hiscores load replaces a previous manual override and re-defaults target.
  useEffect(() => {
    setManualLevel(null);
    setTargetTouched(false);
  }, [hiscoreLevel, hiscoreXp]);

  const currentLevel = manualLevel ?? (hiscoreLevel != null ? clampSkillLevel(hiscoreLevel) : 1);
  const usingExactXp = manualLevel == null && hiscoreXp != null && Number.isFinite(hiscoreXp);
  const currentXp = usingExactXp ? Math.max(0, hiscoreXp!) : xpForLevel(currentLevel);

  // Default target to the next level above current unless the user set it themselves.
  useEffect(() => {
    if (targetTouched) return;
    const next = clampSkillLevel(currentLevel + 1, 2, MAX_SKILL_LEVEL);
    setTargetLevelState(next);
  }, [currentLevel, targetTouched]);

  const targetLevelClamped = clampSkillLevel(targetLevel, 2, MAX_SKILL_LEVEL);
  const xpRemaining = xpRemainingToLevel(currentXp, targetLevelClamped);

  const setTargetLevel = (n: number) => {
    setTargetTouched(true);
    setTargetLevelState(clampSkillLevel(n, 2, MAX_SKILL_LEVEL));
  };

  return {
    view,
    setView,
    targetLevel: targetLevelClamped,
    setTargetLevel,
    currentLevel,
    setCurrentLevel: (n: number) => {
      setManualLevel(clampSkillLevel(n, 1, MAX_SKILL_LEVEL));
      // Changing "Now" re-defaults target to next level.
      setTargetTouched(false);
    },
    currentXp,
    xpRemaining,
    usingExactXp,
  };
}

function MiniStepper({
  value,
  min,
  max,
  onChange,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  ariaLabel: string;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
        aria-label={`Decrease ${ariaLabel}`}
      >
        <Minus className="size-3" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-6 w-9 rounded-md border border-border/50 bg-background px-0.5 text-center text-xs font-semibold tabular-nums text-foreground"
        aria-label={ariaLabel}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
        aria-label={`Increase ${ariaLabel}`}
      >
        <Plus className="size-3" />
      </button>
    </span>
  );
}

/** Compact "train to X" strip under skill icons. */
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
  currentXp?: number;
  xpRemaining?: number;
  usingExactXp?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
      <div className="inline-flex h-7 items-center rounded-full border border-border/60 bg-secondary/30 p-0.5">
        <button
          type="button"
          onClick={() => onViewChange("rate")}
          className={`h-6 rounded-full px-2.5 text-[11px] font-medium ${
            view === "rate" ? "bg-primary/15 text-primary" : "hover:text-foreground"
          }`}
        >
          XP/h
        </button>
        <button
          type="button"
          onClick={() => onViewChange("goal")}
          className={`h-6 rounded-full px-2.5 text-[11px] font-medium ${
            view === "goal" ? "bg-primary/15 text-primary" : "hover:text-foreground"
          }`}
        >
          Train to {targetLevel}
        </button>
      </div>

      <span className="inline-flex items-center gap-1">
        <span>Now</span>
        <MiniStepper
          value={currentLevel}
          min={1}
          max={MAX_SKILL_LEVEL}
          onChange={onCurrentLevelChange}
          ariaLabel={`Current ${skillLabel} level`}
        />
      </span>

      <span className="inline-flex items-center gap-1">
        <span>Target</span>
        <MiniStepper
          value={targetLevel}
          min={2}
          max={MAX_SKILL_LEVEL}
          onChange={onTargetLevelChange}
          ariaLabel="Target skill level"
        />
      </span>
    </div>
  );
}
