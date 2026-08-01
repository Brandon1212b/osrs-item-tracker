import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { fetchItemDetail } from "@/lib/osrs.functions";
import type { RangeKey } from "@/lib/osrs.server";
import { CATALOG } from "@/lib/osrs-catalog";
import { PriceChart } from "@/components/PriceChart";
import { gp, signalOf, timeAgo } from "@/lib/format";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "1d", label: "24h" },
  { key: "1w", label: "1W" },
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "1y", label: "1Y" },
];

export const Route = createFileRoute("/item/$id")({
  head: () => ({
    meta: [
      { title: "Item price & history — GE Watch OSRS" },
      {
        name: "description",
        content:
          "Live Grand Exchange price, historical range chart and wiki training-method notes for an Old School RuneScape item.",
      },
      { property: "og:title", content: "Item price & history — GE Watch OSRS" },
      {
        property: "og:description",
        content: "Live OSRS Grand Exchange price with 24h to 1 year range charts and buy signals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ItemPage,
});

function groupFor(name: string) {
  return CATALOG.find((g) => g.items.some((i) => i.name === name));
}

function ItemPage() {
  const { id } = Route.useParams();
  const [range, setRange] = useState<RangeKey>("6m");
  const getDetail = useServerFn(fetchItemDetail);

  const detail = useQuery({
    queryKey: ["item", id, range],
    queryFn: () => getDetail({ data: { id: Number(id), range } }),
    refetchInterval: 120_000,
  });

  const d = detail.data;
  const row = d?.row;
  const signal = signalOf(d?.trend ?? undefined);
  const group = row ? groupFor(row.name) : undefined;
  const price = row ? (row.high ?? row.low) : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to all items
      </Link>

      {detail.isLoading && <div className="panel mt-4 h-[520px] animate-pulse opacity-60" />}

      {detail.isError && (
        <p className="mt-8 text-sm text-destructive">Couldn't load this item's price history.</p>
      )}

      {row && d && (
        <>
          <header className="panel mt-4 flex flex-wrap items-start gap-4 p-5 sm:p-6">
            <img
              src={`https://oldschool.runescape.wiki/images/${encodeURIComponent(row.icon.replace(/ /g, "_"))}`}
              alt={row.name}
              width={48}
              height={48}
              className="size-12 object-contain drop-shadow"
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-sans text-2xl font-bold leading-tight sm:text-3xl">{row.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{row.examine}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className={`size-3.5 ${detail.isFetching ? "animate-spin" : ""}`} />
                  Updated {timeAgo(row.updated)}
                </span>
                <span>{row.limit ? `Buy limit ${row.limit.toLocaleString()}` : "No buy limit"}</span>
                <span>{row.members ? "Members" : "Free to play"}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tabular-nums gold-text">{gp(price)}</div>
              <span
                className="mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
                style={{ background: `var(--${signal.token})`, color: `var(--${signal.token}-foreground)` }}
              >
                {signal.label}
              </span>
            </div>
          </header>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Stat label="Buy price (high)" value={gp(row.high)} />
            <Stat label="Sell price (low)" value={gp(row.low)} />
            <Stat label="Traded / 24h" value={row.volume ? gp(row.volume) : "—"} />
            <Stat label="High alch" value={row.highalch ? gp(row.highalch) : "—"} />
          </div>

          <section className="panel mt-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Price over {d.rangeLabel}</h2>
              <div className="flex flex-wrap gap-1.5">
                {RANGES.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setRange(r.key)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                      range === r.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <PriceChart series={d.series} tone={signal.token} intraday={range === "1d" || range === "1w"} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <Stat label={`Low (${d.rangeLabel})`} value={gp(d.min)} />
              <Stat label={`High (${d.rangeLabel})`} value={gp(d.max)} />
              <Stat label="Average" value={gp(d.avg)} />
              <Stat
                label="Change"
                value={`${d.change > 0 ? "+" : ""}${d.change}%`}
                tone={d.change > 0 ? "steep" : d.change < 0 ? "deal" : undefined}
              />
            </div>

            {d.trend && (
              <div className="mt-5 space-y-1.5">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${Math.max(2, d.trend.percentile)}%`, background: `var(--${signal.token})` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
                  <span>{gp(d.trend.low180)}</span>
                  <span>
                    Today sits at the {d.trend.percentile}th percentile of the last 180 days
                  </span>
                  <span>{gp(d.trend.high180)}</span>
                </div>
              </div>
            )}
          </section>

          <section className="panel mt-4 p-5 sm:p-6">
            <h2 className="text-lg font-semibold">
              {group?.kind === "skilling" ? "Wiki training method" : "Why players buy this"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {group ? (
                <>
                  <span className="font-medium text-foreground">{group.label}</span> — {group.note}
                </>
              ) : (
                "This item isn't part of a tracked training method."
              )}
            </p>
            <a
              href={`https://oldschool.runescape.wiki/w/${encodeURIComponent(row.name.replace(/ /g, "_"))}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Open on the OSRS Wiki <ExternalLink className="size-3.5" />
            </a>
          </section>

          <footer className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
            Price data from the OSRS Wiki real-time Grand Exchange API. Not affiliated with Jagex.
          </footer>
        </>
      )}
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "deal" | "steep" | undefined }) {
  return (
    <div className="rounded-md bg-secondary/60 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums" style={tone ? { color: `var(--${tone})` } : undefined}>
        {value}
      </div>
    </div>
  );
}
