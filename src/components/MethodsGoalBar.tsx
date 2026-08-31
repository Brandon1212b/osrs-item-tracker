import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
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

  useEffect(() => {
    setManualLevel(null);
    setTargetTouched(false);
  }, [hiscoreLevel, hiscoreXp]);

  const currentLevel = manualLevel ?? (hiscoreLevel != null ? clampSkillLevel(hiscoreLevel) : 1);
  const usingExactXp = manualLevel == null && hiscoreXp != null && Number.isFinite(hiscoreXp);
  const currentXp = usingExactXp ? Math.max(0, hiscoreXp!) : xpForLevel(currentLevel);

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
      setTargetTouched(false);
    },
    currentXp,
    xpRemaining,
    usingExactXp,
  };
}

export function MethodsViewToggle({
  view,
  onViewChange,
  targetLevel,
  onTargetChange,
  minTarget = 2,
}: {
  view: MethodsMetricView;
  onViewChange: (v: MethodsMetricView) => void;
  targetLevel: number;
  onTargetChange: (n: number) => void;
  minTarget?: number;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(targetLevel));
  const min = Math.max(2, minTarget);

  useEffect(() => {
    setDraft(String(targetLevel));
  }, [targetLevel]);

  const commitDraft = () => {
    const n = Number.parseInt(draft.replace(/\D/g, ""), 10);
    if (!Number.isFinite(n)) {
      setDraft(String(targetLevel));
      return;
    }
    onTargetChange(Math.min(MAX_SKILL_LEVEL, Math.max(min, n)));
  };

  return (
    <div className="inline-flex h-8 shrink-0 items-center rounded-full border border-border/60 bg-secondary/30 p-0.5">
      <button
        type="button"
        onClick={() => {
          onViewChange("rate");
          setOpen(false);
        }}
        className={`h-7 rounded-full px-2 text-[11px] font-medium ${
          view === "rate" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        XP/h
      </button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <button
            type="button"
            onClick={() => {
              if (view !== "goal") {
                onViewChange("goal");
                return;
              }
              setOpen((was) => !was);
            }}
            className={`h-7 rounded-full px-2 text-[11px] font-medium ${
              view === "goal" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Train to {targetLevel}
          </button>
        </PopoverAnchor>
        <PopoverContent
          align="center"
          side="bottom"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-auto rounded-full border-border/70 p-1 shadow-lg"
        >
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onTargetChange(targetLevel - 1)}
              disabled={targetLevel <= min}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
              aria-label="Lower target level"
            >
              <Minus className="size-4" />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              onBlur={commitDraft}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="h-8 w-10 rounded-md bg-transparent text-center text-sm font-semibold tabular-nums text-foreground outline-none"
              aria-label="Target level"
            />
            <button
              type="button"
              onClick={() => onTargetChange(targetLevel + 1)}
              disabled={targetLevel >= MAX_SKILL_LEVEL}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
              aria-label="Raise target level"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
