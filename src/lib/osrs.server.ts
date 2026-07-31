const BASE = "https://prices.runescape.wiki/api/v1/osrs";
const UA = "OSRS Gear & Skilling Price Tracker - lovable.app";

type MappingEntry = {
  id: number;
  name: string;
  icon: string;
  limit?: number;
  members: boolean;
  highalch?: number;
  examine: string;
};

type LatestEntry = {
  high: number | null;
  low: number | null;
  highTime: number | null;
  lowTime: number | null;
};

export type PriceRow = {
  id: number;
  name: string;
  icon: string;
  members: boolean;
  limit: number | null;
  highalch: number | null;
  examine: string;
  high: number | null;
  low: number | null;
  updated: number | null;
  volume: number | null;
};

export type Trend = {
  id: number;
  /** 0-100: where today's price sits within the last 180 days. */
  percentile: number;
  low180: number;
  high180: number;
  avg30: number;
  change30: number;
  change90: number;
  series: { t: number; p: number }[];
};

type Cache<T> = { at: number; value: T };

let mappingCache: Cache<MappingEntry[]> | null = null;
let snapshotCache: Cache<PriceRow[]> | null = null;
let trendCache: Cache<Record<number, Trend>> | null = null;
let trendInFlight: Promise<Record<number, Trend>> | null = null;

const MIN = 60_000;

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`OSRS price API ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

async function getMapping(): Promise<MappingEntry[]> {
  if (mappingCache && Date.now() - mappingCache.at < 12 * 60 * MIN) return mappingCache.value;
  const value = await api<MappingEntry[]>("/mapping");
  mappingCache = { at: Date.now(), value };
  return value;
}

export async function getSnapshot(names: string[]): Promise<PriceRow[]> {
  if (snapshotCache && Date.now() - snapshotCache.at < 2 * MIN) return snapshotCache.value;

  const [mapping, latest, day] = await Promise.all([
    getMapping(),
    api<{ data: Record<string, LatestEntry> }>("/latest"),
    api<{ data: Record<string, { highPriceVolume: number; lowPriceVolume: number }> }>("/24h"),
  ]);

  const byName = new Map(mapping.map((m) => [m.name, m]));
  const rows: PriceRow[] = [];
  for (const name of names) {
    const m = byName.get(name);
    if (!m) continue;
    const l = latest.data[String(m.id)];
    const v = day.data[String(m.id)];
    rows.push({
      id: m.id,
      name: m.name,
      icon: m.icon,
      members: m.members,
      limit: m.limit ?? null,
      highalch: m.highalch ?? null,
      examine: m.examine,
      high: l?.high ?? null,
      low: l?.low ?? null,
      updated: l?.highTime ?? l?.lowTime ?? null,
      volume: v ? (v.highPriceVolume ?? 0) + (v.lowPriceVolume ?? 0) : null,
    });
  }
  snapshotCache = { at: Date.now(), value: rows };
  return rows;
}

function summarise(id: number, points: { timestamp: number; avgHighPrice: number | null; avgLowPrice: number | null }[]): Trend | null {
  const series = points
    .map((p) => {
      const hi = p.avgHighPrice;
      const lo = p.avgLowPrice;
      const mid = hi != null && lo != null ? (hi + lo) / 2 : (hi ?? lo);
      return mid != null ? { t: p.timestamp * 1000, p: Math.round(mid) } : null;
    })
    .filter((x): x is { t: number; p: number } => x !== null);

  if (series.length < 20) return null;

  const window = series.slice(-180);
  const prices = window.map((s) => s.p);
  const current = prices[prices.length - 1]!;
  const sorted = [...prices].sort((a, b) => a - b);
  const below = sorted.filter((p) => p < current).length;
  const percentile = Math.round((below / sorted.length) * 100);

  const last30 = prices.slice(-30);
  const avg30 = Math.round(last30.reduce((a, b) => a + b, 0) / last30.length);
  const at = (back: number) => prices[Math.max(0, prices.length - 1 - back)]!;
  const pct = (from: number) => (from ? ((current - from) / from) * 100 : 0);

  return {
    id,
    percentile,
    low180: sorted[0]!,
    high180: sorted[sorted.length - 1]!,
    avg30,
    change30: Math.round(pct(30) * 10) / 10,
    change90: Math.round(pct(90) * 10) / 10,
    series: window.filter((_, i) => i % 2 === 0),
  };
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>) {
  const out: R[] = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]!);
      }
    }),
  );
  return out;
}

export async function getTrends(names: string[]): Promise<Record<number, Trend>> {
  if (trendCache && Date.now() - trendCache.at < 60 * MIN) return trendCache.value;
  if (trendInFlight) return trendInFlight;

  trendInFlight = (async () => {
    const rows = await getSnapshot(names);
    const result: Record<number, Trend> = {};
    await pool(rows, 10, async (row) => {
      try {
        const res = await api<{ data: { timestamp: number; avgHighPrice: number | null; avgLowPrice: number | null }[] }>(
          `/timeseries?timestep=24h&id=${row.id}`,
        );
        const t = summarise(row.id, res.data ?? []);
        if (t) result[row.id] = t;
      } catch {
        /* skip individual failures */
      }
    });
    trendCache = { at: Date.now(), value: result };
    trendInFlight = null;
    return result;
  })();

  return trendInFlight;
}
