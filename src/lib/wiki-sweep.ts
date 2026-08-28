import { checkWikiPages, type WikiCheckPageResult } from "@/lib/wiki-check.functions";
import { listMethodWikiJobs, uniqueWikiHrefs } from "@/lib/method-wiki-jobs";
import {
  storageKey,
  writeLiveChecks,
  writePageRates,
  notifySweep,
  type LiveCheckRecord,
  type StoredPageRates,
} from "@/lib/wiki-check-store";
import { wikiGpMatchesSite, wikiXpMatchesSite, type WikiPageSnapshot } from "@/lib/wiki-page-rates";

export type WikiSweepState = {
  status: "idle" | "running" | "done" | "error";
  done: number;
  total: number;
  methods: number;
  error?: string;
};

const CHUNK = 6;
const SESSION_FLAG = "ge-watch-wiki-sweep-session";

let state: WikiSweepState = { status: "idle", done: 0, total: 0, methods: 0 };
const listeners = new Set<() => void>();

export function getWikiSweepState() {
  return state;
}

export function subscribeWikiSweep(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setState(next: Partial<WikiSweepState>) {
  state = { ...state, ...next };
  for (const fn of listeners) fn();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function toSnap(row: WikiCheckPageResult, date: string): WikiPageSnapshot {
  return {
    pulledAt: date,
    xpPerHour: row.xpPerHour,
    gpPerHour: row.gpPerHour,
    note: row.error ?? "Live wiki read",
  };
}

export async function runWikiSweep(opts?: { force?: boolean }): Promise<void> {
  if (state.status === "running") return;
  if (!opts?.force) {
    try {
      if (sessionStorage.getItem(SESSION_FLAG) === "1" && state.status === "done") return;
    } catch {
      /* */
    }
  }

  const jobs = listMethodWikiJobs();
  const hrefs = uniqueWikiHrefs(jobs);
  setState({ status: "running", done: 0, total: hrefs.length, methods: jobs.length, error: undefined });

  const date = new Date().toISOString().slice(0, 10);
  const byHref: Record<string, WikiCheckPageResult> = {};

  try {
    for (const group of chunk(hrefs, CHUNK)) {
      const rows = await checkWikiPages({
        data: {
          pages: group.map((href) => ({ slot: "wiki" as const, href })),
        },
      });
      for (const row of rows) byHref[row.href] = row;
      setState({ done: Object.keys(byHref).length, total: hrefs.length });
    }

    const pages: Record<string, StoredPageRates> = {};
    for (const [href, row] of Object.entries(byHref)) {
      pages[href] = {
        href,
        date,
        xpPerHour: row.xpPerHour,
        gpPerHour: row.gpPerHour,
        error: row.error,
      };
    }
    writePageRates(pages);

    const checks: Record<string, LiveCheckRecord> = {};
    for (const job of jobs) {
      let hadRates = false;
      let matched = false;
      for (const page of job.pages) {
        const row = byHref[page.href];
        if (!row || row.error) continue;
        const snap = toSnap(row, date);
        if (snap.xpPerHour != null || snap.gpPerHour != null) hadRates = true;
        if (wikiXpMatchesSite(snap, job.siteXp) || wikiGpMatchesSite(snap, null)) matched = true;
      }
      checks[storageKey(job.methodId, job.skillKey)] = { date, matched, hadRates };
    }
    writeLiveChecks(checks);
    notifySweep();

    try {
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      /* */
    }
    setState({ status: "done", done: hrefs.length, total: hrefs.length, methods: jobs.length });
  } catch (err) {
    setState({
      status: "error",
      error: err instanceof Error ? err.message : "Wiki sweep failed",
    });
  }
}
