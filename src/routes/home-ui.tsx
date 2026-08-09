import {
  GEAR_SLOT_FILTERS,
} from "@/lib/osrs-catalog";
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
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  wikiIcon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex size-8 items-center justify-center rounded-full border transition-colors ${
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
    </button>
  );
}
