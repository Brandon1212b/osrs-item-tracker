import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CircleHelp, Loader2, TrendingUp, Zap } from "lucide-react";

import { useMarketData } from "@/hooks/useMarketData";
import { WikiImage } from "@/components/WikiImage";
import { CATALOG_SKILLS } from "@/lib/method-catalog";
import {
  auditActivity,
  auditRecipe,
  rowHasLiveGe,
  rowHasRed,
  sourceIsTrusted,
  type AuditedMethod,
} from "@/lib/method-sources";
import { formatCompact } from "@/lib/format";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Method sources — GE Watch" },
      {
        name: "description",
        content: "Audit table for every skilling method: XP/hr and GP/hr sources, live GE vs residual.",
      },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  const { snapshot } = useMarketData("6m");
  const [skill, setSkill] = useState<string>("all");
  const [onlyRed, setOnlyRed] = useState(false);
  const [onlyLive, setOnlyLive] = useState(false);
  const [onlyScaled, setOnlyScaled] = useState(false);
  const [q, setQ] = useState("");

  const rowsByName = useMemo(
    () => new Map((snapshot.data ?? []).map((r) => [r.name, r])),
    [snapshot.data],
  );

  const rows = useMemo(() => {
    const list: AuditedMethod[] = [];
    for (const s of CATALOG_SKILLS) {
      for (const m of s.methods) list.push(auditRecipe(s.key, s.label, s.wikiIcon, m, rowsByName));
      for (const a of s.activities) list.push(auditActivity(s.key, s.label, s.wikiIcon, a, rowsByName));
    }
    return list;
  }, [rowsByName]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const out = rows.filter((r) => {
      if (skill !== "all" && r.skillKey !== skill) return false;
      if (onlyRed && !rowHasRed(r)) return false;
      if (onlyLive && !rowHasLiveGe(r)) return false;
      if (onlyScaled && !r.xpLevelScaled) return false;
      if (query && !`${r.label} ${r.id} ${r.skillLabel}`.toLowerCase().includes(query)) return false;
      return true;
    });
    out.sort((a, b) => {
      const ar = rowHasRed(a) ? 0 : 1;
      const br = rowHasRed(b) ? 0 : 1;
      if (ar !== br) return ar - br;
      if (a.skillLabel !== b.skillLabel) return a.skillLabel.localeCompare(b.skillLabel);
      return a.level - b.level || a.label.localeCompare(b.label);
    });
    return out;
  }, [rows, skill, onlyRed, onlyLive, onlyScaled, q]);

  const redCount = rows.filter(rowHasRed).length;

  return (
    <main className="mx-auto max-w-7xl px-3 pb-16 pt-3 sm:px-4">
      <div className="mb-3 flex items-start gap-2">
        <CircleHelp className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div>
          <h1 className="text-base font-semibold text-foreground">Method sources</h1>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            Every method on Skilling Methods. Green = we can point at the linked wiki page or live GE.
            Red = estimate / unknown origin.{" "}
            <Zap className="inline size-3 text-violet-400" /> = live GE (changes with prices).{" "}
            <TrendingUp className="inline size-3 text-sky-400" /> = XP scales with level. Residual is a
            hardcoded leftover EV, not a live price.
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {rows.length} methods · {redCount} with a red tag
          </p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="h-8 rounded-md border border-border/60 bg-secondary/30 px-2 text-xs"
        >
          <option value="all">All skills</option>
          {CATALOG_SKILLS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="h-8 w-36 rounded-md border border-border/60 bg-background px-2 text-xs sm:w-48"
        />
        <FilterChip active={onlyRed} onClick={() => setOnlyRed((v) => !v)} label="Red only" />
        <FilterChip active={onlyLive} onClick={() => setOnlyLive((v) => !v)} label="Live GE" />
        <FilterChip active={onlyScaled} onClick={() => setOnlyScaled((v) => !v)} label="Level-scaled" />
      </div>

      {snapshot.isLoading && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading prices…
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full min-w-[40rem] border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-background/95 backdrop-blur">
            <tr className="border-b border-border/60 text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-2 py-2 font-medium">Method</th>
              <th className="px-2 py-2 font-medium">XP/hr</th>
              <th className="px-2 py-2 font-medium">GP/hr</th>
              <th className="px-2 py-2 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={`${r.skillKey}:${r.id}`} className="border-b border-border/40 align-top">
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5">
                    <WikiImage icon={r.wikiIcon} alt="" width={16} height={16} className="size-4 shrink-0" />
                    <span className="font-medium text-foreground">{r.label}</span>
                  </div>
                  <div className="pl-5 text-[10px] text-muted-foreground">
                    {r.skillLabel} · lvl {r.level}
                    {r.kind === "activity" ? " · activity" : ""}
                  </div>
                </td>
                <td className="px-2 py-2">
                  <ValueCell
                    amount={r.xpPerHour}
                    trusted={sourceIsTrusted(r.xpSource)}
                    dynamic={r.xpDynamic}
                    levelScaled={r.xpLevelScaled}
                  />
                </td>
                <td className="px-2 py-2">
                  {r.gpParts.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {r.gpParts.map((p) => (
                        <div key={p.label} className="flex flex-wrap items-baseline gap-1">
                          <ValueCell
                            amount={p.amount}
                            trusted={sourceIsTrusted(p.source)}
                            dynamic={p.dynamic}
                            missing={p.missing}
                          />
                          <span className="text-[10px] text-muted-foreground">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-2 py-2">
                  <a
                    href={r.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-sky-400 underline-offset-2 hover:underline"
                    title={r.link.title}
                  >
                    {r.link.kind}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !snapshot.isLoading && (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">No methods match.</p>
        )}
      </div>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-full border px-2.5 text-[11px] font-medium ${
        active
          ? "border-primary/70 bg-primary/15 text-primary"
          : "border-border/60 bg-secondary/30 text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function ValueCell({
  amount,
  trusted,
  dynamic,
  levelScaled,
  missing,
}: {
  amount: number | null;
  trusted: boolean;
  dynamic?: boolean;
  levelScaled?: boolean;
  missing?: boolean;
}) {
  const color = trusted ? "text-emerald-400" : "text-red-400";
  return (
    <span className={`inline-flex items-center gap-0.5 tabular-nums ${color}`}>
      {amount == null ? (missing ? "missing GE" : "—") : formatCompact(amount)}
      {dynamic && <Zap className="size-3 shrink-0 text-violet-400" aria-label="Live GE" />}
      {levelScaled && <TrendingUp className="size-3 shrink-0 text-sky-400" aria-label="Scales with level" />}
    </span>
  );
}
