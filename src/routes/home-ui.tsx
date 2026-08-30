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
  return (
    <div className="grid grid-cols-3 gap-1">
      {SKILLS_PANEL.map((s) => {
        const enabled = !enabledKeys || enabledKeys.has(s.key);
        const selected = enabled && active === s.key;
        const level = levels?.[s.key];
        return (
          <button
            key={s.key}
            type="button"
            title={s.label}
            aria-label={level != null ? `${s.label} ${level}` : s.label}
            aria-pressed={selected}
            disabled={!enabled}
            onClick={() => {
              if (!enabled) return;
              onSelect(active === s.key ? "all" : s.key);
            }}
            className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-left transition-colors ${
              !enabled
                ? "cursor-default border-border/30 bg-secondary/10 opacity-40"
                : selected
                  ? "border-primary/70 bg-primary/15 ring-1 ring-primary/40"
                  : "border-border/50 bg-background/60 hover:bg-secondary/60"
            }`}
          >
            <WikiImage
              icon={s.wikiIcon}
              alt=""
              width={20}
              height={20}
              lazy={false}
              className="size-5 shrink-0"
              draggable={false}
            />
            <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-foreground/90">
              {level != null ? level : s.label}
            </span>
          </button>
        );
      })}
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
