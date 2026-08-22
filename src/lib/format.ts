import type { Trend } from "./osrs.server";

/**
 * Compact number formatting targeting ~4 significant digits.
 *
 * Rules:
 * - Below 10,000: exact integer with comma thousands separator
 * - 10,000–99,999: k, 2 decimals
 * - 100,000–999,999: k, 1 decimal
 * - 1,000,000–9,999,999: m, 3 decimals
 * - 10,000,000–99,999,999: m, 2 decimals
 * - 100,000,000–999,999,999: m, 1 decimal
 * - 1,000,000,000+: same pattern with b (3/2/1 decimals as integer digits grow)
 * - Negatives: leading "-"
 * - Trailing ".0" / ".00" / ".000" trimmed when all decimal digits are zero
 */
export function formatCompact(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";

  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  if (abs < 10_000) {
    return `${sign}${Math.round(abs).toLocaleString("en-US")}`;
  }

  let divisor: number;
  let suffix: string;

  if (abs >= 1_000_000_000) {
    divisor = 1_000_000_000;
    suffix = "b";
  } else if (abs >= 1_000_000) {
    divisor = 1_000_000;
    suffix = "m";
  } else {
    divisor = 1_000;
    suffix = "k";
  }

  const scaled = abs / divisor;
  // Integer digits in the scaled value (before decimal)
  const intDigits = scaled >= 100 ? 3 : scaled >= 10 ? 2 : 1;
  // Target 4 significant digits total → decimals = 4 - intDigits, clamped 0–3
  const decimals = Math.max(0, Math.min(3, 4 - intDigits));

  let body = scaled.toFixed(decimals);
  // Trim trailing zeros only when the entire decimal portion is zero
  if (decimals > 0 && /\.0+$/.test(body)) {
    body = body.replace(/\.0+$/, "");
  }

  return `${sign}${body}${suffix}`;
}

/** Compact gold amounts. Null/undefined → "—". */
export function gp(n: number | null | undefined): string {
  return formatCompact(n);
}

/** Compact number for XP rates / costs. Always numeric (no Free+). */
export function compactNum(n: number): string {
  return formatCompact(n);
}

/** Your-cost display: always the real number (including negatives / zero). */
export function formatCost(v: number | null): string {
  if (v == null) return "—";
  return compactNum(v);
}

/** Hours to a skill target. Always one decimal, e.g. "12.4h". */
export function formatHours(h: number | null | undefined): string {
  if (h == null || !Number.isFinite(h)) return "—";
  const n = Math.max(0, h);
  return `${n.toFixed(1)}h`;
}

export type Signal = {
  label: string;
  token: "deal" | "fair" | "steep";
  rank: number;
};

/** Turns the range percentile into a plain buying recommendation. */
export function signalOf(trend?: Trend): Signal {
  if (!trend) return { label: "No data", token: "fair", rank: 2 };
  const p = trend.percentile;
  if (p <= 15) return { label: "Great buy", token: "deal", rank: 0 };
  if (p <= 35) return { label: "Cheap", token: "deal", rank: 1 };
  if (p <= 70) return { label: "Fair", token: "fair", rank: 2 };
  if (p <= 88) return { label: "Pricey", token: "steep", rank: 3 };
  return { label: "Wait", token: "steep", rank: 4 };
}

export function timeAgo(unixSeconds: number | null | undefined) {
  if (!unixSeconds) return "unknown";
  const mins = Math.max(0, Math.round((Date.now() - unixSeconds * 1000) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}
