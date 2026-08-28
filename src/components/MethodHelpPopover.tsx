import { Check, CircleHelp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SkillingMethod } from "@/components/skilling-types";
import type { ActivityMethod } from "@/lib/activity-methods";
import { methodLinkTrio, type WikiSlot } from "@/lib/method-links";
import { getMethodValidation } from "@/lib/method-validation";
import {
  formatWikiXp,
  getWikiSlotRates,
  wikiGpMatchesSite,
  wikiXpMatchesSite,
  type WikiSlotKey,
} from "@/lib/wiki-page-rates";
import { gp as formatGp } from "@/lib/format";

export function MethodHelpPopover({
  methodId,
  skillKey,
  method,
  activity,
  xpPerHour,
  gpPerHour,
  rateBandLevel,
}: {
  methodId: string;
  skillKey?: string;
  method?: SkillingMethod;
  activity?: ActivityMethod;
  xpPerHour: number;
  gpPerHour: number | null;
  rateBandLevel?: number;
}) {
  const links = methodLinkTrio(methodId, skillKey);
  const xpText = describeXp(method, activity, xpPerHour, rateBandLevel);
  const gpText = describeGp(method, activity, gpPerHour);
  const validation = getMethodValidation(methodId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Rate sources"
        >
          <CircleHelp className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-[min(22rem,calc(100vw-2rem))] space-y-3 p-3 text-xs"
      >
        <ValidationBadge validation={validation} />
        <section>
          <p className="font-semibold text-foreground">XP/hr</p>
          <p className="mt-0.5 text-muted-foreground">{xpText}</p>
        </section>
        <section>
          <p className="font-semibold text-foreground">GP/hr</p>
          <p className="mt-0.5 text-muted-foreground">{gpText}</p>
        </section>
        <section>
          <p className="mb-1.5 font-semibold text-foreground">Links</p>
          <div className="grid grid-cols-3 gap-1.5">
            <LinkBox
              label="MMG"
              slotKey="mmg"
              slot={links.mmg}
              methodId={methodId}
              skillKey={skillKey}
              siteXp={xpPerHour}
              siteGp={gpPerHour}
            />
            <LinkBox
              label="Skill guide"
              slotKey="skillGuide"
              slot={links.skillGuide}
              methodId={methodId}
              skillKey={skillKey}
              siteXp={xpPerHour}
              siteGp={gpPerHour}
            />
            <LinkBox
              label="Wiki"
              slotKey="wiki"
              slot={links.wiki}
              methodId={methodId}
              skillKey={skillKey}
              siteXp={xpPerHour}
              siteGp={gpPerHour}
            />
          </div>
        </section>
      </PopoverContent>
    </Popover>
  );
}

function ValidationBadge({
  validation,
}: {
  validation: ReturnType<typeof getMethodValidation>;
}) {
  const color =
    validation.status === "fresh"
      ? "text-emerald-400"
      : validation.status === "stale"
        ? "text-amber-400"
        : "text-red-400";
  return (
    <p className={`text-[11px] font-medium ${color}`}>{validation.label}</p>
  );
}

function MatchCheck({ ok }: { ok: boolean | null }) {
  if (!ok) return null;
  return <Check className="size-3 text-emerald-400" aria-label="Within 10% of our rate" />;
}

function LinkBox({
  label,
  slotKey,
  slot,
  methodId,
  skillKey,
  siteXp,
  siteGp,
}: {
  label: string;
  slotKey: WikiSlotKey;
  slot: WikiSlot;
  methodId: string;
  skillKey?: string;
  siteXp: number;
  siteGp: number | null;
}) {
  const snap = slot ? getWikiSlotRates(methodId, slotKey, skillKey) : undefined;
  const xpLabel = snap ? formatWikiXp(snap) : null;
  const xpOk = snap ? wikiXpMatchesSite(snap, siteXp) : null;
  const gpOk = snap ? wikiGpMatchesSite(snap, siteGp) : null;

  return (
    <div className="rounded-md border border-border/60 bg-secondary/30 px-1.5 py-1.5">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      {slot ? (
        <a
          href={slot.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 block truncate font-medium text-sky-400 underline-offset-2 hover:underline"
          title={slot.title}
        >
          Open
        </a>
      ) : (
        <div className="mt-0.5 text-muted-foreground">—</div>
      )}
      {xpLabel ? (
        <div className="mt-1 flex items-center gap-0.5 text-[10px] text-foreground" title={snap?.note}>
          <span className="text-muted-foreground">XP</span>
          <span>{xpLabel}</span>
          <MatchCheck ok={xpOk} />
        </div>
      ) : null}
      {snap?.gpPerHour != null ? (
        <div className="flex items-center gap-0.5 text-[10px] text-foreground" title={snap.note}>
          <span className="text-muted-foreground">GP</span>
          <span>{formatGp(snap.gpPerHour)}</span>
          <MatchCheck ok={gpOk} />
        </div>
      ) : null}
    </div>
  );
}

function describeXp(
  method: SkillingMethod | undefined,
  activity: ActivityMethod | undefined,
  xpPerHour: number,
  rateBandLevel?: number,
): string {
  const shown = Math.round(xpPerHour).toLocaleString();
  if (activity) {
    const bands = activity.rateBands;
    if (bands.length > 1) {
      return `${shown} XP/h from the stored level table (band used: lvl ${rateBandLevel ?? bands[bands.length - 1]!.level}). Static — not from the live price API. XP/h rises with your level when you load an RSN.`;
    }
    return `${shown} XP/h is a stored hourly rate on this activity (not live).`;
  }
  if (method) {
    return `${method.xp} XP per action × ${method.actionsPerHour.toLocaleString()} actions/h = ${shown} XP/h. Static (saved in code). Does not update with GE prices.`;
  }
  return `${shown} XP/h is stored in code. Static.`;
}

function describeGp(
  method: SkillingMethod | undefined,
  activity: ActivityMethod | undefined,
  gpPerHour: number | null,
): string {
  if (activity) {
    const hasItems = activity.rewards.length > 0 || activity.consumables.length > 0;
    const residual = activity.rateBands.some((b) => (b.expectedLootGpPerHour ?? 0) !== 0);
    if (hasItems && residual) {
      return `Live GE on listed rewards − consumables (buy high / sell low after 2% tax), plus a stored residual EV for loot we have not itemized. The GE part updates with prices.`;
    }
    if (hasItems) {
      return `Live GE: sell rewards (low, after 2% tax) − buy consumables (high), using the stored qty/h. Updates with the price feed.`;
    }
    if (residual) {
      return `Stored residual EV only (no itemized GE loot). Static — does not track live prices.`;
    }
    return `No GP model — no rewards, consumables, or residual.`;
  }
  if (method) {
    const hasIo =
      method.inputs.length > 0 ||
      method.output != null ||
      (method.outputs != null && method.outputs.length > 0);
    if (!hasIo) {
      return `No GE inputs or outputs, so GP/h is empty. Static. This is XP-only (courses).`;
    }
    if (gpPerHour == null) {
      return `Would be live GE (inputs × buy, outputs × sell after tax × actions/h) but a component has no price.`;
    }
    return `Live GE: (output sell after 2% tax − input buy) × ${method.actionsPerHour.toLocaleString()} actions/h. Updates with the price feed.`;
  }
  return `GP/h source unknown.`;
}
