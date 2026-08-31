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

const RS_YELLOW = "#ffff00";
const RS_FONT = '"RuneScape Bold 12", monospace';
const RS_PIXEL: React.CSSProperties = {
  color: RS_YELLOW,
  fontFamily: RS_FONT,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: 1,
  letterSpacing: 0,
  textShadow: "1px 1px 0 #000",
  fontSmooth: "never",
  WebkitFontSmoothing: "none",
};

function SkillLevelMark({ level }: { level: number }) {
  return (
    <span
      className="flex min-w-[22px] flex-1 items-center justify-center select-none"
      style={RS_PIXEL}
    >
      {level}
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
    <div className="shrink-0" style={{ width: 204 }}>
      <div
        style={{
          background: "#3e3529",
          boxShadow: "0 0 0 1px #1a140c, inset 0 0 0 1px #6a5a3a",
          padding: 2,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(3, 62px)",
            gridAutoRows: "32px",
            gap: 2,
            background: "#2b2b2b",
            padding: 2,
          }}
        >
          {SKILLS_PANEL.map((s) => {
            const enabled = !enabledKeys || enabledKeys.has(s.key);
            const selected = enabled && active === s.key;
            const level = levels?.[s.key] ?? 1;
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
                className="flex items-center"
                style={{
                  width: 62,
                  height: 32,
                  padding: "0 2px 0 1px",
                  background: selected ? "#5a4a28" : "#494949",
                  boxShadow: selected
                    ? "inset 1px 1px 0 #d2b15a, inset -1px -1px 0 #2a1e08, 0 0 0 1px #c9a44a"
                    : "inset 1px 1px 0 #222, inset -1px -1px 0 #6e6e6e",
                  opacity: enabled ? 1 : 0.38,
                  cursor: enabled ? "pointer" : "default",
                }}
              >
                <WikiImage
                  icon={s.wikiIcon}
                  alt=""
                  width={25}
                  height={25}
                  lazy={false}
                  className="size-[25px] shrink-0 [image-rendering:pixelated]"
                  draggable={false}
                />
                <SkillLevelMark level={level} />
              </button>
            );
          })}
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            ...RS_PIXEL,
            height: 32,
            marginTop: 2,
            background: "#111",
            boxShadow: "inset 1px 1px 0 #000, inset -1px -1px 0 #3a3a3a",
          }}
        >
          Total level: {hasLevels ? total : "—"}
        </div>
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
