import { ChevronDown } from "lucide-react";
import { GEAR_SLOT_FILTERS } from "@/lib/osrs-catalog";
import { SKILLS_PANEL } from "@/lib/skills-panel";
import { WikiImage } from "@/components/WikiImage";

export function EquipmentPaperDoll({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div
      className="inline-grid shrink-0 grid-cols-3 gap-1 rounded-lg border border-border/60 bg-secondary/20 p-1.5"
      style={{ width: "fit-content" }}
    >
      {GEAR_SLOT_FILTERS.map((slot) => (
        <button
          key={slot.key}
          type="button"
          title={slot.label}
          aria-label={slot.label}
          aria-pressed={active === slot.key}
          onClick={() => onSelect(active === slot.key ? "all" : slot.key)}
          style={{ gridRow: slot.row, gridColumn: slot.col }}
          className={`flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors ${
            active === slot.key
              ? "border-primary/70 bg-primary/15 ring-1 ring-primary/40"
              : "border-border/50 bg-background/60 hover:bg-secondary/60"
          }`}
        >
          <WikiImage
            icon={slot.wikiIcon}
            alt=""
            width={24}
            height={24}
            lazy={false}
            className="size-6 opacity-90"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}

function SkillLevelMark({ level }: { level: number }) {
  return (
    <span className="relative block h-[30px] w-[34px] shrink-0 font-[Tahoma,Arial,sans-serif] text-[13px] font-bold leading-none text-[#ffff00] [text-shadow:1px_1px_0_#000]">
      <span className="absolute left-0 top-0 tabular-nums">{level}</span>
      <span className="absolute left-[13px] top-[8px] text-[15px] font-semibold">/</span>
      <span className="absolute bottom-0 right-0 tabular-nums">{level}</span>
    </span>
  );
}

export function SkillsPanel({
  active,
  onSelect,
  levels,
  enabledKeys,
}: {
  active: string;
  onSelect: (key: string) => void;
  levels?: Record<string, number> | null;
  enabledKeys?: ReadonlySet<string>;
}) {
  const total = SKILLS_PANEL.reduce((sum, s) => sum + (levels?.[s.key] ?? 1), 0);
  const hasLevels = levels != null && Object.keys(levels).length > 0;

  return (
    <div
      className="mx-auto w-full max-w-[360px] overflow-hidden rounded-sm p-[3px]"
      style={{
        background: "linear-gradient(180deg, #6b5428 0%, #3d3016 40%, #2b2216 100%)",
        boxShadow: "0 0 0 1px #1a140c, inset 0 0 0 1px #8a6d34",
      }}
    >
      <div
        className="grid grid-cols-3 gap-[3px] p-[4px]"
        style={{
          backgroundColor: "#4a4a4a",
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.28) 0.6px, transparent 0.7px), linear-gradient(#505050, #3f3f3f)",
          backgroundSize: "3px 3px, 100% 100%",
        }}
      >
        {SKILLS_PANEL.map((s) => {
          const enabled = !enabledKeys || enabledKeys.has(s.key);
          const selected = enabled && active === s.key;
          const raw = levels?.[s.key];
          const level = raw ?? 1;
          return (
            <button
              key={s.key}
              type="button"
              title={s.label}
              aria-label={`${s.label} ${level}`}
              aria-pressed={selected}
              disabled={!enabled}
              onClick={() => {
                if (!enabled) return;
                onSelect(active === s.key ? "all" : s.key);
              }}
              className="flex h-[46px] items-center justify-between px-1.5"
              style={{
                background: selected ? "#6a5a32" : "#555555",
                boxShadow: selected
                  ? "inset 1px 1px 0 #c9a44a, inset -1px -1px 0 #2a220e, 0 0 0 1px #e2c15a"
                  : "inset 1px 1px 0 #2a2a2a, inset -1px -1px 0 #7a7a7a",
                opacity: enabled ? 1 : 0.38,
                cursor: enabled ? "pointer" : "default",
              }}
            >
              <WikiImage
                icon={s.wikiIcon}
                alt=""
                width={26}
                height={26}
                lazy={false}
                className="size-[26px] shrink-0 [image-rendering:pixelated]"
                draggable={false}
              />
              <SkillLevelMark level={level} />
            </button>
          );
        })}
      </div>
      <div
        className="px-2 py-1 text-center font-[Tahoma,Arial,sans-serif] text-[13px] font-bold text-[#ffff00] [text-shadow:1px_1px_0_#000]"
        style={{ background: "#0b0b0b" }}
      >
        Total level: {hasLevels ? total : "—"}
      </div>
    </div>
  );
}

export function FilterCollapse({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/15">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left"
      >
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>
      {open && <div className="border-t border-border/40 p-2.5 pt-2">{children}</div>}
    </div>
  );
}

export function Tab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function SubTab({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }> | undefined;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? "border-primary/70 bg-primary/15 text-primary"
          : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
      }`}
    >
      {Icon && <Icon className="size-3" />}
      {label}
    </button>
  );
}

export function WikiIconTab({
  active,
  onClick,
  label,
  wikiIcon,
  level,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  wikiIcon: string;
  level?: number;
}) {
  const title = level != null ? `${label} ${level}` : label;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-full border px-1.5 transition-colors ${
        active
          ? "border-primary/70 bg-primary/15 ring-1 ring-primary/40"
          : "border-border/60 bg-secondary/30 hover:bg-secondary/50"
      }`}
    >
      <WikiImage
        icon={wikiIcon}
        alt=""
        width={20}
        height={20}
        lazy={false}
        className="size-5"
        draggable={false}
      />
      {level != null && (
        <span className="pr-0.5 text-[11px] font-semibold tabular-nums text-foreground/90">{level}</span>
      )}
    </button>
  );
}
