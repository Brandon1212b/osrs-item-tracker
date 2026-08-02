import type { Trend } from "./osrs.server";

export function gp(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}b`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}m`;
  if (n >= 100_000) return `${Math.round(n / 1000)}k`;
  return n.toLocaleString();
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
