import { CircleHelp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SkillingMethod } from "@/components/skilling-types";
import type { ActivityMethod } from "@/lib/activity-methods";
import { methodLinkTrio, type WikiSlot } from "@/lib/method-links";

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
        className="w-[min(20rem,calc(100vw-2rem))] space-y-3 p-3 text-xs"
      >
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
            <LinkBox label="MMG" slot={links.mmg} />
            <LinkBox label="Skill guide" slot={links.skillGuide} />
            <LinkBox label="Wiki" slot={links.wiki} />
          </div>
        </section>
      </PopoverContent>
    </Popover>
  );
}

function LinkBox({ label, slot }: { label: string; slot: WikiSlot }) {
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
    return `${shown} XP/h is a stored hourly rate on this activity (not live). Check the Skill guide / Wiki / MMG links; if they disagree, the stored rate needs a fix.`;
  }
  if (method) {
    return `${method.xp} XP per action × ${method.actionsPerHour.toLocaleString()} actions/h = ${shown} XP/h. Static (saved in code). Does not update with GE prices. If the linked guide lists a different XP/h, the stored XP or actions/h is wrong.`;
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
      return `Live GE on listed rewards − consumables (buy high / sell low after 2% tax), plus a stored residual EV for loot we have not itemized. The GE part updates with prices. If this is far from the MMG, the residual or the item list needs a fix.`;
    }
    if (hasItems) {
      return `Live GE: sell rewards (low, after 2% tax) − buy consumables (high), using the stored qty/h. Updates with the price feed. If this is far from the MMG, the qty/h list does not match the guide.`;
    }
    if (residual) {
      return `Stored residual EV only (no itemized GE loot). Static — does not track live prices. If this is far from the MMG, replace the residual with the guide’s item list.`;
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
    return `Live GE: (output sell after 2% tax − input buy) × ${method.actionsPerHour.toLocaleString()} actions/h. Updates with the price feed. If this is far from the MMG, the input/output list or actions/h does not match the guide.`;
  }
  return `GP/h source unknown.`;
}
