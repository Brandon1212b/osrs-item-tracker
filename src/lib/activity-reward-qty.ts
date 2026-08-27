/** Per-band output qty when the wiki table is XP/h and output XP is fixed. */
export function activityRewardQty(
  activityId: string,
  xpPerHour: number,
  listedQty: number,
): number {
  if (activityId === "teak-logs") return xpPerHour / 85;
  return listedQty;
}
