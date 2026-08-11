/** Shared UX helpers for skilling method cards. */
export function deriveIntensity(
  m: { id: string; label: string; intensity?: "low" | "medium" | "high" | null },
  isActivity = false,
): "low" | "medium" | "high" {
  if (m.intensity === "low" || m.intensity === "medium" || m.intensity === "high") return m.intensity;
  const s = `${m.id} ${m.label}`.toLowerCase();
  if (
    s.includes("1-tick") ||
    s.includes("1tick") ||
    s.includes("barrage") ||
    s.includes("burst") ||
    s.includes("blackjack") ||
    s.includes("sepulchre")
  )
    return "high";
  if (
    s.includes("birdhouse") ||
    s.includes("herbiboar") ||
    s.includes("wintertodt") ||
    s.includes("motherlode") ||
    s.includes("shooting-stars") ||
    s.includes("afk")
  )
    return "low";
  return "medium";
}

export function intensityClass(level: "low" | "medium" | "high"): string {
  if (level === "low") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
  if (level === "high") return "border-amber-500/40 bg-amber-500/10 text-amber-400";
  return "border-border/60 bg-secondary/40 text-muted-foreground";
}

export const MONEY_PRESETS = [
  { label: "500k", value: 500_000 },
  { label: "1m", value: 1_000_000 },
  { label: "2m", value: 2_000_000 },
  { label: "5m", value: 5_000_000 },
] as const;
