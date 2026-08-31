import { useState } from "react";
import { gp } from "@/lib/format";

export const G_MIN = 250_000;
export const G_MAX = 10_000_000;
export const G_STEP = 250_000;

export function parseGpInput(raw: string): number | null {
  const s = raw.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "").replace(/\/h$/, "");
  const m = s.match(/^(-?\d*\.?\d+)([kmb])?$/);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  const mul = m[2] === "b" ? 1_000_000_000 : m[2] === "m" ? 1_000_000 : m[2] === "k" ? 1_000 : 1;
  return Math.round(n * mul);
}

export function MoneyMakingSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const parsed = parseGpInput(draft);
    setEditing(false);
    if (parsed == null) return;
    onChange(Math.min(G_MAX, Math.max(G_MIN, parsed)));
  };

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center gap-2">
        <p className="shrink-0 text-[12px] font-medium text-foreground">Your rate</p>
        <p className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
          Higher rate favors faster methods. Lower rate favors gold-while-training.
        </p>
        {editing ? (
          <input
            autoFocus
            type="text"
            inputMode="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="h-7 w-[5.5rem] shrink-0 rounded-md border border-border/60 bg-background px-1.5 text-right text-[12px] font-semibold tabular-nums text-foreground outline-none"
            aria-label="Your money-making rate per hour"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(gp(value));
              setEditing(true);
            }}
            className="shrink-0 rounded-md px-1 text-[12px] font-semibold tabular-nums text-foreground hover:bg-secondary/50"
          >
            {gp(value)}/h
          </button>
        )}
      </div>
      <input
        type="range"
        min={G_MIN}
        max={G_MAX}
        step={G_STEP}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label="Your money-making rate per hour"
      />
    </div>
  );
}
