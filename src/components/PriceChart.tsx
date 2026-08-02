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
  const h = 280;
  const padL = 8;
  const padR = 8;
  const padT = 28;
  const padB = 28;
  const prices = series.map((s) => s.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;

  const highIdx = prices.indexOf(max);
  const lowIdx = prices.indexOf(min);

  const x = (i: number) => padL + (i / (series.length - 1)) * (w - padL - padR);
  const y = (p: number) => padT + (1 - (p - min) / span) * (h - padT - padB);

  // Percent positions for HTML overlays (match SVG viewBox)
  const pctX = (i: number) => `${(x(i) / w) * 100}%`;
  const pctY = (p: number) => `${(y(p) / h) * 100}%`;

  const line = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(s.p).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1)},${h - padB} L${padL},${h - padB} Z`;
  const gid = `chart-${tone}`;

  const fmtTime = (t: number) =>
    new Date(t).toLocaleString(undefined, intraday ? { hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" });

  const active = hover != null ? series[hover] : null;

  return (
    <div className="relative">
      <div className="relative h-72 w-full">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="absolute inset-0 h-full w-full touch-none"
          preserveAspectRatio="none"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const rel = ((e.clientX - r.left) / r.width) * w;
            const i = Math.round(((rel - padL) / (w - padL - padR)) * (series.length - 1));
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
              x2={w - padR}
              y1={padT + f * (h - padT - padB)}
              y2={padT + f * (h - padT - padB)}
              stroke="var(--border)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke={`var(--${tone})`} strokeWidth="2" vectorEffect="non-scaling-stroke" />

          {active && hover != null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={padT - 6}
              y2={h - padB}
              stroke="var(--muted-foreground)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 3"
            />
          )}
        </svg>

        {/* HTML overlays — not stretched by preserveAspectRatio=none */}
        <Marker
          left={pctX(highIdx)}
          top={pctY(max)}
          kind="high"
          label={`High ${gp(max)}`}
          sub={fmtTime(series[highIdx]!.t)}
          preferRight={highIdx / (series.length - 1) < 0.55}
        />
        <Marker
          left={pctX(lowIdx)}
          top={pctY(min)}
          kind="low"
          label={`Low ${gp(min)}`}
          sub={fmtTime(series[lowIdx]!.t)}
          preferRight={lowIdx / (series.length - 1) < 0.55}
        />

        {active && hover != null && (
          <div
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background"
            style={{
              left: pctX(hover),
              top: pctY(active.p),
              background: `var(--${tone})`,
            }}
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-1 flex justify-center px-1 text-xs text-muted-foreground tabular-nums">
          {active ? (
            <span className="rounded-md bg-background/90 px-2.5 py-1 font-medium shadow-sm backdrop-blur">
              {fmtTime(active.t)} · {gp(active.p)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex justify-between px-1 text-xs text-muted-foreground tabular-nums">
        <span>{fmtTime(series[0]!.t)}</span>
        <span>{fmtTime(series[series.length - 1]!.t)}</span>
      </div>
    </div>
  );
}

function Marker({
  left,
  top,
  kind,
  label,
  sub,
  preferRight,
}: {
  left: string;
  top: string;
  kind: "high" | "low";
  label: string;
  sub: string;
  preferRight: boolean;
}) {
  const color = kind === "high" ? "var(--steep)" : "var(--deal)";
  return (
    <div
      className="pointer-events-none absolute z-[1] -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      <div
        className="size-3 rounded-full border-2 border-background shadow-sm"
        style={{ background: color }}
      />
      <div
        className={`absolute top-1/2 whitespace-nowrap ${preferRight ? "left-full ml-2" : "right-full mr-2"} -translate-y-1/2`}
      >
        <div className="text-xs font-semibold tabular-nums leading-tight" style={{ color }}>
          {label}
        </div>
        <div className="text-[11px] tabular-nums leading-tight text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
