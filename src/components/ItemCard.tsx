import { Link } from "@tanstack/react-router";
import { Sparkline } from "@/components/Sparkline";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import { gp, signalOf } from "@/lib/format";

const ICON_BASE = "https://oldschool.runescape.wiki/images/";
const SCROLL_KEY = "ge-watch-home-scroll";

/** % vs range high: negative = cheaper than the peak in the selected window. */
function pctFromHigh(price: number | null | undefined, trend?: Trend): number | null {
  if (price == null || !trend?.high180 || trend.high180 <= 0) return null;
  return Math.round(((price - trend.high180) / trend.high180) * 1000) / 10;
}

export function ItemCard({ row, trend }: { row: PriceRow; trend?: Trend | undefined }) {
  const price = row.high ?? row.low;
  const signal = signalOf(trend);
  const pct = pctFromHigh(price, trend);

  return (
    <article className="panel group relative flex flex-col gap-1.5 p-2 sm:gap-2 sm:p-3 transition-transform duration-200 hover:-translate-y-0.5">
      <Link
        to="/item/$id"
        params={{ id: String(row.id) }}
        className="absolute inset-0 z-10 rounded-[inherit]"
        aria-label={`View ${row.name} price history`}
        onClick={() => {
          try {
            sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
          } catch {
            /* private mode */
          }
        }}
      />
      {trend ? (
        <div className="absolute top-1.5 right-1.5 z-20 flex flex-col gap-0.5 text-[9px] tabular-nums leading-none text-right sm:top-2 sm:right-2 sm:text-[10px] sm:gap-1">
          <span className="text-muted-foreground">H <span className="font-medium text-foreground">{gp(trend.high180)}</span></span>
          <span className="text-muted-foreground">L <span className="font-medium text-foreground">{gp(trend.low180)}</span></span>
        </div>
      ) : null}
      <div className="flex items-start gap-2 sm:gap-3">
        <img
          src={`${ICON_BASE}${encodeURIComponent(row.icon.replace(/ /g, "_"))}`}
          alt={row.name}
          loading="lazy"
          width={28}
          height={28}
          className="mt-0.5 size-7 shrink-0 object-contain drop-shadow sm:size-8"
        />
        <div className="min-w-0 flex-1 pr-8 sm:pr-10">
          <h3 className="truncate font-sans text-xs font-semibold text-foreground sm:text-sm" title={row.name}>
            {row.name}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-bold tabular-nums gold-text sm:text-base">{gp(price)}</p>
            {pct != null && (
              <span
                className="inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none"
                style={{
                  background:
                    pct < 0
                      ? "color-mix(in oklab, var(--deal) 22%, transparent)"
                      : pct > 0
                        ? "color-mix(in oklab, var(--steep) 22%, transparent)"
                        : "var(--secondary)",
                  color: pct < 0 ? "var(--deal)" : pct > 0 ? "var(--steep)" : "var(--muted-foreground)",
                }}
                title="vs range high"
              >
                {pct > 0 ? "+" : ""}
                {pct}%
              </span>
            )}
          </div>
        </div>
      </div>

      {trend ? (
        <Sparkline series={trend.series} tone={signal.token} />
      ) : (
        <div className="h-10 rounded-md border border-dashed border-border/60 bg-muted/30 sm:h-12" />
      )}
    </article>
  );
}
