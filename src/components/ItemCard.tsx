import { Link } from "@tanstack/react-router";
import { Sparkline } from "@/components/Sparkline";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import { gp, signalOf } from "@/lib/format";

const ICON_BASE = "https://oldschool.runescape.wiki/images/";
const SCROLL_KEY = "ge-watch-home-scroll";

export function ItemCard({ row, trend }: { row: PriceRow; trend?: Trend | undefined }) {
  const price = row.high ?? row.low;
  const signal = signalOf(trend);

  return (
    <article className="panel group relative flex flex-col gap-2 p-3 transition-transform duration-200 hover:-translate-y-0.5">
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
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 text-[10px] tabular-nums leading-none text-right">
          <span className="text-muted-foreground">H <span className="font-medium text-foreground">{gp(trend.high180)}</span></span>
          <span className="text-muted-foreground">L <span className="font-medium text-foreground">{gp(trend.low180)}</span></span>
        </div>
      ) : null}
      <div className="flex items-start gap-3">
        <img
          src={`${ICON_BASE}${encodeURIComponent(row.icon.replace(/ /g, "_"))}`}
          alt={row.name}
          loading="lazy"
          width={32}
          height={32}
          className="mt-0.5 size-8 shrink-0 object-contain drop-shadow"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-sans text-sm font-semibold text-foreground" title={row.name}>
            {row.name}
          </h3>
          <p className="text-base font-bold tabular-nums gold-text">{gp(price)}</p>
        </div>
      </div>

      {trend ? (
        <Sparkline series={trend.series} tone={signal.token} />
      ) : (
        <div className="h-12 rounded-md border border-dashed border-border/60 bg-muted/30" />
      )}
    </article>
  );
}
