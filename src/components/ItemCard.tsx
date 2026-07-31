import { Sparkline } from "@/components/Sparkline";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import { gp, signalOf } from "@/lib/format";

const ICON_BASE = "https://oldschool.runescape.wiki/images/";

export function ItemCard({ row, trend }: { row: PriceRow; trend?: Trend | undefined }) {
  const price = row.high ?? row.low;
  const signal = signalOf(trend);

  return (
    <article className="panel group relative flex flex-col gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <img
          src={`${ICON_BASE}${encodeURIComponent(row.icon.replace(/ /g, "_"))}`}
          alt={row.name}
          loading="lazy"
          width={36}
          height={36}
          className="mt-0.5 size-9 shrink-0 object-contain drop-shadow"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground" title={row.name}>
            {row.name}
          </h3>
          <p className="mt-0.5 text-lg font-bold tabular-nums gold-text">{gp(price)}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: `var(--${signal.token})`, color: `var(--${signal.token}-foreground)` }}
        >
          {signal.label}
        </span>
      </div>

      {trend ? (
        <>
          <Sparkline series={trend.series} tone={signal.token} />
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <Stat label="vs 30d avg" value={`${pctStr(((price ?? 0) - trend.avg30) / trend.avg30)}`} />
            <Stat label="30d" value={pctStr(trend.change30 / 100)} />
            <Stat label="90d" value={pctStr(trend.change90 / 100)} />
          </div>
          <div className="space-y-1">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${Math.max(2, trend.percentile)}%`, background: `var(--${signal.token})` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
              <span>{gp(trend.low180)}</span>
              <span>{trend.percentile}% of 180d range</span>
              <span>{gp(trend.high180)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-[86px] rounded-md border border-dashed border-border/60 bg-muted/30" />
      )}

      <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
        <span>{row.limit ? `Buy limit ${row.limit.toLocaleString()}` : "No buy limit"}</span>
        <span className="tabular-nums">{row.volume ? `${gp(row.volume)} traded/24h` : "—"}</span>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const negative = value.startsWith("-");
  return (
    <div className="rounded-md bg-secondary/60 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className="font-semibold tabular-nums"
        style={{ color: negative ? "var(--deal)" : "var(--steep)" }}
      >
        {value}
      </div>
    </div>
  );
}

function pctStr(fraction: number) {
  if (!isFinite(fraction)) return "—";
  const v = fraction * 100;
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
