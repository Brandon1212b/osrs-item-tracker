import { useState } from "react";
import { gp } from "@/lib/format";

type Point = { t: number; p: number };

export function PriceChart({
  series,
  tone = "fair",
  intraday,
}: {
  series: Point[];
  tone?: "deal" | "fair" | "steep";
  intraday: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);

  if (series.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border/60 text-sm text-muted-foreground">
        Not enough price history for this range.
      </div>
    );
  }

  const w = 800;
  const h = 260;
  const padL = 8;
  const padB = 22;
  const prices = series.map((s) => s.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;

  const x = (i: number) => padL + (i / (series.length - 1)) * (w - padL * 2);
  const y = (p: number) => 10 + (1 - (p - min) / span) * (h - padB - 16);

  const line = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(s.p).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1)},${h - padB} L${padL},${h - padB} Z`;
  const gid = `chart-${tone}`;

  const fmtTime = (t: number) =>
    new Date(t).toLocaleString(undefined, intraday ? { hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" });

  const active = hover != null ? series[hover] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-64 w-full touch-none"
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - r.left) / r.width) * w;
          const i = Math.round(((rel - padL) / (w - padL * 2)) * (series.length - 1));
          setHover(Math.min(series.length - 1, Math.max(0, i)));
        }}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`var(--${tone})`} stopOpacity="0.35" />
            <stop offset="100%" stopColor={`var(--${tone})`} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padL}
            x2={w - padL}
            y1={10 + f * (h - padB - 16)}
            y2={10 + f * (h - padB - 16)}
            stroke="var(--border)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={`var(--${tone})`} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {active && hover != null && (
          <>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={6}
              y2={h - padB}
              stroke="var(--muted-foreground)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={x(hover)} cy={y(active.p)} r="4" fill={`var(--${tone})`} vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-1 text-[11px] text-muted-foreground tabular-nums">
        <span>{gp(max)}</span>
        <span>{active ? `${fmtTime(active.t)} · ${gp(active.p)} gp` : ""}</span>
      </div>
      <div className="flex justify-between px-1 text-[11px] text-muted-foreground tabular-nums">
        <span>{fmtTime(series[0]!.t)}</span>
        <span>low {gp(min)}</span>
        <span>{fmtTime(series[series.length - 1]!.t)}</span>
      </div>
    </div>
  );
}
