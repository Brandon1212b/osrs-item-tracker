import { useEffect, useState } from "react";
import { Check, CircleHelp, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SkillingMethod } from "@/components/skilling-types";
import type { ActivityMethod } from "@/lib/activity-methods";
import { methodLinkTrio, type WikiSlot } from "@/lib/method-links";
import { getMethodValidation, type ValidationDisplay } from "@/lib/method-validation";
import {
  formatWikiXp,
  getWikiSlotRates,
  wikiGpMatchesSite,
  wikiXpMatchesSite,
  type WikiPageSnapshot,
  type WikiSlotKey,
} from "@/lib/wiki-page-rates";
import { checkWikiPages, type WikiCheckPageResult } from "@/lib/wiki-check.functions";
import { gp as formatGp } from "@/lib/format";

const LIVE_KEY = "ge-watch-wiki-check";

type LiveCheckRecord = {
  date: string;
  matched: boolean;
  hadRates: boolean;
};

function storageKey(methodId: string, skillKey?: string) {
  return skillKey ? `${skillKey}:${methodId}` : methodId;
}

function readLiveCheck(methodId: string, skillKey?: string): LiveCheckRecord | null {
  try {
    const raw = localStorage.getItem(LIVE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, LiveCheckRecord>;
    return all[storageKey(methodId, skillKey)] ?? null;
  } catch {
    return null;
  }
}

function writeLiveCheck(methodId: string, skillKey: string | undefined, rec: LiveCheckRecord) {
  try {
    const raw = localStorage.getItem(LIVE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, LiveCheckRecord>) : {};
    all[storageKey(methodId, skillKey)] = rec;
    localStorage.setItem(LIVE_KEY, JSON.stringify(all));
  } catch {
    /* private mode */
  }
}

function displayFromLive(rec: LiveCheckRecord): ValidationDisplay {
  if (rec.matched) {
    return { status: "fresh", checkedAt: rec.date, label: `Validated ${rec.date}` };
  }
  if (rec.hadRates) {
    return { status: "none", checkedAt: null, label: `Not validated as of ${rec.date}` };
  }
  return { status: "none", checkedAt: null, label: `Not validated as of ${rec.date}` };
}

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
  const baked = getMethodValidation(methodId);
  const [liveRec, setLiveRec] = useState<LiveCheckRecord | null>(null);
  const [live, setLive] = useState<Partial<Record<WikiSlotKey, WikiCheckPageResult>> | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  useEffect(() => {
    setLiveRec(readLiveCheck(methodId, skillKey));
  }, [methodId, skillKey]);

  const validation = liveRec ? displayFromLive(liveRec) : baked;

  const pages = ([
    links.mmg ? { slot: "mmg" as const, href: links.mmg.href } : null,
    links.skillGuide ? { slot: "skillGuide" as const, href: links.skillGuide.href } : null,
    links.wiki ? { slot: "wiki" as const, href: links.wiki.href } : null,
  ].filter(Boolean) as { slot: WikiSlotKey; href: string }[]);

  const runCheck = async () => {
    if (pages.length === 0 || checking) return;
    setChecking(true);
    setCheckError(null);
    try {
      const rows = await checkWikiPages({ data: { pages, skillKey } });
      const next: Partial<Record<WikiSlotKey, WikiCheckPageResult>> = {};
      for (const row of rows) next[row.slot] = row;
      setLive(next);

      const date = new Date().toISOString().slice(0, 10);
      let hadRates = false;
      let matched = false;
      for (const row of rows) {
        if (row.error) continue;
        const snap = liveToSnap(row, date);
        const xpOk = wikiXpMatchesSite(snap, xpPerHour);
        const gpOk = wikiGpMatchesSite(snap, gpPerHour);
        if (snap.xpPerHour != null || snap.gpPerHour != null) hadRates = true;
        if (xpOk || gpOk) matched = true;
      }
      const rec: LiveCheckRecord = { date, matched, hadRates };
      setLiveRec(rec);
      writeLiveCheck(methodId, skillKey, rec);
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "Check failed");
    } finally {
      setChecking(false);
    }
  };

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
              live={live?.mmg}
            />
            <LinkBox
              label="Skill guide"
              slotKey="skillGuide"
              slot={links.skillGuide}
              methodId={methodId}
              skillKey={skillKey}
              siteXp={xpPerHour}
              siteGp={gpPerHour}
              live={live?.skillGuide}
            />
            <LinkBox
              label="Wiki"
              slotKey="wiki"
              slot={links.wiki}
              methodId={methodId}
              skillKey={skillKey}
              siteXp={xpPerHour}
              siteGp={gpPerHour}
              live={live?.wiki}
            />
          </div>
          <button
            type="button"
            onClick={() => void runCheck()}
            disabled={checking || pages.length === 0}
            className="mt-2 inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-border/60 bg-secondary/40 text-[11px] font-medium hover:bg-secondary/60 disabled:opacity-50"
          >
            {checking ? <Loader2 className="size-3 animate-spin" /> : null}
            {checking ? "Checking wiki…" : live || liveRec ? "Check wiki again" : "Check wiki now"}
          </button>
          {checkError ? <p className="mt-1 text-[11px] text-destructive">{checkError}</p> : null}
          {live ? (
            <p className="mt-1 text-[10px] text-muted-foreground">Live read just now. Green check = within 10% of our row.</p>
          ) : null}
        </section>
      </PopoverContent>
    </Popover>
  );
}

function ValidationBadge({
  validation,
}: {
  validation: ValidationDisplay;
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

function liveToSnap(live: WikiCheckPageResult, date = new Date().toISOString().slice(0, 10)): WikiPageSnapshot {
  return {
    pulledAt: date,
    xpPerHour: live.xpPerHour,
    gpPerHour: live.gpPerHour,
    note: live.error ?? "Live wiki read",
  };
}

function LinkBox({
  label,
  slotKey,
  slot,
  methodId,
  skillKey,
  siteXp,
  siteGp,
  live,
}: {
  label: string;
  slotKey: WikiSlotKey;
  slot: WikiSlot;
  methodId: string;
  skillKey?: string;
  siteXp: number;
  siteGp: number | null;
  live?: WikiCheckPageResult;
}) {
  const stored = slot ? getWikiSlotRates(methodId, slotKey, skillKey) : undefined;
  const snap = live && !live.error ? liveToSnap(live) : stored;
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
      {live?.error ? (
        <p className="mt-1 text-[10px] text-destructive">{live.error}</p>
      ) : null}
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
