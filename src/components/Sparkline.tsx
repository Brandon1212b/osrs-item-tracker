export function Sparkline({
  series,
  tone,
}: {
  series: { t: number; p: number }[];
  tone: "deal" | "fair" | "steep";
}) {
  if (series.length < 2) return <div className="h-14" />;

  const w = 240;
  const h = 56;
  const prices = series.map((s) => s.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;

  const pts = series.map((s, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = h - ((s.p - min) / span) * (h - 6) - 3;
    return [x, y] as const;
  });

  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const id = `spark-${tone}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`var(--${tone})`} stopOpacity="0.35" />
          <stop offset="100%" stopColor={`var(--${tone})`} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={`var(--${tone})`} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
