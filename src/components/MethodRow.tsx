import { Link } from "@tanstack/react-router";
import { CircleHelp, Pin, Star } from "lucide-react";
import type { PriceRow } from "@/lib/osrs.server";
import { gp, compactNum, formatCost, formatHours } from "@/lib/format";
import { WikiImage } from "@/components/WikiImage";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { intensityClass } from "@/components/methods-ux";
import type { RankedMethod, SkillingMethod, MethodPart } from "@/components/skilling-types";
import type { MethodsMetricView } from "@/components/MethodsGoalBar";

const SCROLL_KEY = "ge-watch-home-scroll";

function buyPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.high ?? row.low ?? null;
}
function sellPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.low ?? row.high ?? null;
}
function chipIcon(row: PriceRow | undefined, name: string): string {
  if (row?.icon) return row.icon;
  return `${name.replace(/ /g, "_")}.png`;
}
function saveScroll() {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  } catch {
    /* */
  }
}

export function MethodRow({
  rank,
  method,
  activity,
  label,
  level,
  rowsByName,
  skillLabel,
  xpPerHour,
  gpPerHour,
  profitPerCraft,
  netChangePct,
  costPerXp,
  missing,
  locked,
  secondaryLine,
  notes,
  intensity,
  rateBandLevel,
  hoursToTarget,
  totalGp,
  comparing,
  onToggleCompare,
  onWatchInputs,
  metricView = "rate",
  xpRemaining = 0,
}: RankedMethod & {
  rank: number;
  rowsByName: Map<string, PriceRow>;
  skillLabel: string;
  comparing?: boolean;
  onToggleCompare?: () => void;
  onWatchInputs?: () => void;
  metricView?: MethodsMetricView;
  /** XP still needed to target — used to scale supply totals in goal view */
  xpRemaining?: number;
}) {
  const isActivity = activity != null;
  /** Actions needed if training this method the whole way to the target. */
  const goalActions =
    metricView === "goal" && method && method.xp > 0 && xpRemaining > 0
      ? xpRemaining / method.xp
      : null;
  const scaleQty = (qty: number) => (goalActions == null ? qty : qty * goalActions);
  const titlePart = method
    ? (method.outputs && method.outputs.length > 0 ? method.outputs[0] : method.output) ??
      method.inputs[0]
    : undefined;
  const titleRow =
    titlePart && titlePart.name !== "Coins" ? rowsByName.get(titlePart.name) : undefined;
  const titleIcon = titlePart ? chipIcon(titleRow, titlePart.name) : null;

  return (
    <article
      className={`panel flex flex-col gap-2 p-3 sm:p-3.5 ${locked ? "opacity-45" : ""}`}
      title={locked ? `Requires ${skillLabel} ${level}` : undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground">
            {rank}
          </span>
          {titleIcon && (
            <span className="flex size-10 shrink-0 items-center justify-center">
              <WikiImage
                icon={titleIcon}
                alt={titlePart?.name ?? ""}
                width={40}
                height={40}
                className="size-10 drop-shadow-sm"
                lazy={false}
              />
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold leading-tight">{label}</h3>
              {intensity && (
                <span className={`rounded-full border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${intensityClass(intensity)}`}>
                  {intensity}
                </span>
              )}
              <RateSourceHelp isActivity={isActivity} notes={notes} method={method} />
              {onToggleCompare && (
                <button type="button" onClick={onToggleCompare} aria-pressed={comparing} title={comparing ? "Unpin" : "Pin to compare"}
                  className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full ${comparing ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                  <Pin className="size-3.5" />
                </button>
              )}
              {method && onWatchInputs && (
                <button type="button" onClick={onWatchInputs} title="Add method inputs to watchlist"
                  className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Star className="size-3.5" />
                </button>
              )}
            </div>
            <p
              className={`text-[11px] ${
                locked ? "font-semibold text-amber-500/90" : "text-muted-foreground"
              }`}
            >
              {isActivity && rateBandLevel != null
                ? `Unlock ${level} | rates @ ${rateBandLevel}`
                : `Lvl ${level}`}
              {locked ? " | locked" : ""}
              {secondaryLine ? ` | ${secondaryLine}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-right text-xs tabular-nums">
          {metricView === "goal" ? (
            <Stat
              label="Time"
              value={formatHours(hoursToTarget)}
              title="Hours at this method's XP/h from your current XP to the target level"
            />
          ) : (
            <Stat label="XP/h" value={compactNum(Math.round(xpPerHour))} />
          )}
          {metricView === "goal" ? (
            <Stat
              label="Total"
              value={totalGp == null ? "-" : `${totalGp > 0 ? "+" : ""}${gp(totalGp)}`}
              tone={totalGp == null ? undefined : totalGp >= 0 ? "deal" : "steep"}
              title="GP earned or spent if you train only this method to the target"
            />
          ) : (
            <Stat
              label="GP/h"
              value={gpPerHour == null ? "-" : `${gpPerHour > 0 ? "+" : ""}${gp(gpPerHour)}`}
              tone={gpPerHour == null ? undefined : gpPerHour >= 0 ? "deal" : "steep"}
            />
          )}
          <Stat
            label="Your cost"
            value={costPerXp == null ? "-" : `${formatCost(costPerXp)} gp/xp`}
            emphasis
            tone={
              costPerXp == null
                ? undefined
                : costPerXp <= 0
                  ? "deal"
                  : costPerXp <= 15
                    ? "deal"
                    : costPerXp >= 40
                      ? "steep"
                      : undefined
            }
            title="Supplies + opportunity cost of not money-making, per XP. Lower is better."
          />
        </div>
      </div>
      {isActivity ? (
        <div className="space-y-1 text-xs">
          <p className="text-[11px] text-muted-foreground">
            Activity method — expected reward value (not a single GE output)
          </p>
          {notes && <p className="text-[11px] text-muted-foreground">{notes}</p>}
          {missing && (
            <p className="text-[11px] text-muted-foreground">(partial / missing price data)</p>
          )}
        </div>
      ) : method ? (
        <div className="flex flex-nowrap items-center gap-1 overflow-x-auto text-xs">
          {method.inputs.length === 0 &&
            !method.output &&
            !(method.outputs && method.outputs.length > 0) && (
              <span className="text-[11px] text-muted-foreground">No GE inputs (course XP)</span>
            )}
          {method.inputs.map((part, idx) => (
            <span key={`in-${part.name}-${idx}`} className="inline-flex shrink-0 items-center gap-1">
              {idx > 0 && <span className="px-0.5 text-muted-foreground">+</span>}
              <PartChip
                name={part.name}
                qty={scaleQty(part.qty)}
                row={part.name === "Coins" ? undefined : rowsByName.get(part.name)}
                kind="input"
                total={goalActions != null}
              />
            </span>
          ))}
          {(() => {
            const outs =
              method.outputs && method.outputs.length > 0
                ? method.outputs
                : method.output
                  ? [method.output]
                  : [];
            if (outs.length === 0) return null;
            return (
              <>
                <span className="shrink-0 px-0.5 text-muted-foreground">→</span>
                {outs.map((part, idx) => (
                  <span
                    key={`out-${part.name}-${idx}`}
                    className="inline-flex shrink-0 items-center gap-1"
                  >
                    {idx > 0 && <span className="px-0.5 text-muted-foreground">+</span>}
                    <PartChip
                      name={part.name}
                      qty={scaleQty(part.qty)}
                      row={part.name === "Coins" ? undefined : rowsByName.get(part.name)}
                      kind="output"
                      total={goalActions != null}
                    />
                  </span>
                ))}
              </>
            );
          })()}
          {profitPerCraft != null && (
            <span
              className="ml-auto inline-flex shrink-0 items-center gap-1 tabular-nums"
              title={
                goalActions != null
                  ? "Total net if you train only this method to the target"
                  : "Net vs 30-day average component prices"
              }
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Net
              </span>
              <span
                className="font-bold"
                style={{
                  color:
                    (goalActions != null ? profitPerCraft * goalActions : profitPerCraft) >= 0
                      ? "var(--deal)"
                      : "var(--steep)",
                }}
              >
                {(() => {
                  const net =
                    goalActions != null
                      ? Math.round(profitPerCraft * goalActions)
                      : profitPerCraft;
                  return `${net > 0 ? "+" : ""}${gp(net)}`;
                })()}
              </span>
              {netChangePct != null && goalActions == null && (
                <span
                  className="inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none"
                  style={{
                    background:
                      netChangePct > 0
                        ? "color-mix(in oklab, var(--deal) 22%, transparent)"
                        : netChangePct < 0
                          ? "color-mix(in oklab, var(--steep) 22%, transparent)"
                          : "var(--secondary)",
                    color:
                      netChangePct > 0
                        ? "var(--deal)"
                        : netChangePct < 0
                          ? "var(--steep)"
                          : "var(--muted-foreground)",
                  }}
                  title="Change in net vs 30-day average prices"
                >
                  {netChangePct > 0 ? "+" : ""}
                  {netChangePct}%
                </span>
              )}
            </span>
          )}
          {missing && (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              (partial / missing price data)
            </span>
          )}
        </div>
      ) : null}
    </article>
  );
}

function RateSourceHelp({
  isActivity,
  notes,
  method,
}: {
  isActivity: boolean;
  notes?: string | null;
  method?: SkillingMethod;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Where do these rates come from?"
        >
          <CircleHelp className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-[min(18rem,calc(100vw-2rem))] space-y-2 p-3 text-xs"
      >
        <p className="font-semibold text-foreground">Where these numbers come from</p>
        <ul className="space-y-1.5 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">XP/h</span> — Focused rates from the OSRS
            Wiki training guides (static). Assumes attentive play and normal banking; not max
            tick-perfect unless the method says so.
          </li>
          <li>
            <span className="font-medium text-foreground">GP/h & Net</span> — Calculated live from
            current Grand Exchange prices (buy high / sell low). Updates automatically with the
            price feed.
          </li>
          <li>
            <span className="font-medium text-foreground">Your cost</span> — (money-making rate −
            method GP/h) ÷ XP/h. Lower is better; negative means the method beats your rate.
          </li>
        </ul>
        {isActivity && notes && (
          <p className="border-t border-border/60 pt-2 text-muted-foreground">
            <span className="font-medium text-foreground">This method:</span> {notes}
          </p>
        )}
        {!isActivity && method && (
          <p className="border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
            {method.xp} XP × {method.actionsPerHour.toLocaleString()} actions/h ={" "}
            {Math.round(method.xp * method.actionsPerHour).toLocaleString()} XP/h
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

function formatQty(qty: number): string {
  if (Number.isInteger(qty)) return String(qty);
  return qty.toFixed(1);
}

function PartChip({
  name,
  qty,
  row,
  kind,
  total = false,
}: {
  name: string;
  qty: number;
  row: PriceRow | undefined;
  kind: "input" | "output";
  /** When true, qty is a total-to-target figure (may be large) */
  total?: boolean;
}) {
  const unit = name === "Coins" ? 1 : kind === "input" ? buyPrice(row) : sellPrice(row);
  const price = unit == null ? null : unit * qty;
  const qtyLabel = total ? compactNum(Math.round(qty)) : formatQty(qty);
  const showQty = total || qty !== 1;
  const inner = (
    <>
      <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
        <WikiImage icon={chipIcon(row, name)} alt={name} width={24} height={24} className="size-6" />
        {showQty && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded bg-background/90 px-0.5 text-[9px] font-bold leading-none tabular-nums text-foreground ring-1 ring-border/60">
            {qtyLabel}
          </span>
        )}
      </span>
      <span className="text-[11px] font-semibold tabular-nums text-foreground">
        {price == null ? "-" : gp(price)}
      </span>
    </>
  );
  const className =
    "inline-flex items-center gap-1 rounded-md border border-border/50 bg-secondary/30 px-1.5 py-1 transition-colors hover:border-primary/50 hover:bg-primary/10";
  if (row?.id != null) {
    return (
      <Link
        to="/item/$id"
        params={{ id: String(row.id) }}
        className={className}
        title={
          showQty && unit != null
            ? total
              ? `${name} × ${qtyLabel} total @ ${gp(unit)} each`
              : `${name} x ${qtyLabel} @ ${gp(unit)} each`
            : name
        }
        aria-label={`View ${name} price history`}
        onClick={saveScroll}
      >
        {inner}
      </Link>
    );
  }
  return (
    <span className={className} title={name}>
      {inner}
    </span>
  );
}

function Stat({
  label,
  value,
  tone,
  emphasis,
  title,
}: {
  label: string;
  value: string;
  tone?: "deal" | "steep" | undefined;
  emphasis?: boolean;
  title?: string;
}) {
  return (
    <div className="min-w-[4.5rem]" title={title}>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={`font-semibold ${emphasis ? "text-sm text-foreground" : ""}`}
        style={tone ? { color: `var(--${tone})` } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
