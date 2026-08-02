const BASE = "https://prices.runescape.wiki/api/v1/osrs";
const UA = "OSRS Gear & Skilling Price Tracker - lovable.app";
/** Per-item equipment stats (osrsreboxed / osrsbox-compatible schema). */
const ITEM_META_URL = (id: number) =>
  `https://raw.githubusercontent.com/0xNeffarion/osrsreboxed-db/master/docs/items-json/${id}.json`;

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

export type EquipmentStats = {
  attack_stab: number;
  attack_slash: number;
  attack_crush: number;
  attack_magic: number;
  attack_ranged: number;
  defence_stab: number;
  defence_slash: number;
  defence_crush: number;
  defence_magic: number;
  defence_ranged: number;
  melee_strength: number;
  ranged_strength: number;
  magic_damage: number;
  prayer: number;
  slot: string;
  requirements: Record<string, number> | null;
  attack_speed: number | null;
  weapon_type: string | null;
};

type Cache<T> = { at: number; value: T };

let mappingCache: Cache<MappingEntry[]> | null = null;
let snapshotCache: Cache<PriceRow[]> | null = null;
let trendCache: Cache<Record<number, Trend>> | null = null;
let trendInFlight: Promise<Record<number, Trend>> | null = null;
const equipmentCache = new Map<number, Cache<EquipmentStats | null>>();

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
    change30: Math.round(pct(at(30)) * 10) / 10,
    change90: Math.round(pct(at(90)) * 10) / 10,
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

export type RangeKey = "1d" | "1w" | "1m" | "3m" | "6m" | "1y";

const RANGES: Record<RangeKey, { step: "5m" | "1h" | "6h" | "24h"; points: number; label: string }> = {
  "1d": { step: "5m", points: 288, label: "24 hours" },
  "1w": { step: "1h", points: 168, label: "7 days" },
  "1m": { step: "6h", points: 120, label: "30 days" },
  "3m": { step: "24h", points: 90, label: "3 months" },
  "6m": { step: "24h", points: 180, label: "6 months" },
  "1y": { step: "24h", points: 365, label: "1 year" },
};

export type ItemDetail = {
  row: PriceRow;
  range: RangeKey;
  rangeLabel: string;
  series: { t: number; p: number }[];
  min: number;
  max: number;
  avg: number;
  change: number;
  trend: Trend | null;
  equipment: EquipmentStats | null;
};

const detailCache = new Map<string, Cache<ItemDetail>>();

async function getEquipmentStats(id: number): Promise<EquipmentStats | null> {
  const cached = equipmentCache.get(id);
  if (cached && Date.now() - cached.at < 24 * 60 * MIN) return cached.value;

  try {
    const res = await fetch(ITEM_META_URL(id), {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) {
      equipmentCache.set(id, { at: Date.now(), value: null });
      return null;
    }
    const data = (await res.json()) as {
      equipable_by_player?: boolean;
      equipment?: {
        attack_stab: number;
        attack_slash: number;
        attack_crush: number;
        attack_magic: number;
        attack_ranged: number;
        defence_stab: number;
        defence_slash: number;
        defence_crush: number;
        defence_magic: number;
        defence_ranged: number;
        melee_strength: number;
        ranged_strength: number;
        magic_damage: number;
        prayer: number;
        slot: string;
        requirements?: Record<string, number> | null;
      };
      weapon?: { attack_speed?: number; weapon_type?: string };
    };

    if (!data.equipable_by_player || !data.equipment) {
      equipmentCache.set(id, { at: Date.now(), value: null });
      return null;
    }

    const e = data.equipment;
    const value: EquipmentStats = {
      attack_stab: e.attack_stab ?? 0,
      attack_slash: e.attack_slash ?? 0,
      attack_crush: e.attack_crush ?? 0,
      attack_magic: e.attack_magic ?? 0,
      attack_ranged: e.attack_ranged ?? 0,
      defence_stab: e.defence_stab ?? 0,
      defence_slash: e.defence_slash ?? 0,
      defence_crush: e.defence_crush ?? 0,
      defence_magic: e.defence_magic ?? 0,
      defence_ranged: e.defence_ranged ?? 0,
      melee_strength: e.melee_strength ?? 0,
      ranged_strength: e.ranged_strength ?? 0,
      magic_damage: e.magic_damage ?? 0,
      prayer: e.prayer ?? 0,
      slot: e.slot ?? "",
      requirements: e.requirements ?? null,
      attack_speed: data.weapon?.attack_speed ?? null,
      weapon_type: data.weapon?.weapon_type ?? null,
    };
    equipmentCache.set(id, { at: Date.now(), value });
    return value;
  } catch {
    equipmentCache.set(id, { at: Date.now(), value: null });
    return null;
  }
}

export async function getItemDetail(names: string[], id: number, range: RangeKey): Promise<ItemDetail> {
  const key = `${id}:${range}`;
  const cached = detailCache.get(key);
  const ttl = range === "1d" ? 2 * MIN : 15 * MIN;
  if (cached && Date.now() - cached.at < ttl) return cached.value;

  const rows = await getSnapshot(names);
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error("Unknown item");

  const cfg = RANGES[range];
  const [res, equipment] = await Promise.all([
    api<{ data: { timestamp: number; avgHighPrice: number | null; avgLowPrice: number | null }[] }>(
      `/timeseries?timestep=${cfg.step}&id=${id}`,
    ),
    getEquipmentStats(id),
  ]);
  const series = (res.data ?? [])
    .map((p) => {
      const mid = p.avgHighPrice != null && p.avgLowPrice != null ? (p.avgHighPrice + p.avgLowPrice) / 2 : (p.avgHighPrice ?? p.avgLowPrice);
      return mid != null ? { t: p.timestamp * 1000, p: Math.round(mid) } : null;
    })
    .filter((x): x is { t: number; p: number } => x !== null)
    .slice(-cfg.points);

  const prices = series.map((s) => s.p);
  const first = prices[0] ?? 0;
  const last = prices[prices.length - 1] ?? 0;
  const trend = summarise(id, res.data ?? []);

  const value: ItemDetail = {
    row,
    range,
    rangeLabel: cfg.label,
    series,
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
    avg: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
    change: first ? Math.round(((last - first) / first) * 1000) / 10 : 0,
    trend,
    equipment,
  };
  detailCache.set(key, { at: Date.now(), value });
  return value;
}
