import type { Trend } from "./osrs.server";

/** Compact gold amounts: 140000 → 140k, negatives supported. */
export function gp(n: number | null | undefined): string {
  if (n == null) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)}b`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2)}m`;
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1000)}k`;
  return `${sign}${Math.round(abs).toLocaleString()}`;
}

/** Compact number for XP rates / costs. 140000 → 140k. Always numeric (no Free+). */
export function compactNum(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2)}m`;
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1000)}k`;
  if (abs >= 100) return `${sign}${Math.round(abs)}`;
  return `${sign}${abs.toFixed(1)}`;
}

/** Your-cost display: always the real number (including negatives / zero). */
export function formatCost(v: number | null): string {
  if (v == null) return "—";
  return compactNum(v);
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
