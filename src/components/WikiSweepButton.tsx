import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  getWikiSweepState,
  runWikiSweep,
  subscribeWikiSweep,
} from "@/lib/wiki-sweep";

export function WikiSweepButton() {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeWikiSweep(() => setTick((n) => n + 1)), []);
  useEffect(() => {
    void runWikiSweep();
  }, []);
  const state = getWikiSweepState();
  void tick;

  const running = state.status === "running";
  const label = running
    ? `${state.done}/${state.total}`
    : state.status === "error"
      ? "Retry wiki"
      : "Check wiki";

  return (
    <button
      type="button"
      onClick={() => void runWikiSweep({ force: true })}
      disabled={running}
      title="Fetch XP/GP from every method's wiki pages and compare to our rates"
      className="ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border/60 bg-secondary/40 px-2 text-[11px] font-medium text-foreground hover:bg-secondary/60 disabled:opacity-60"
    >
      {running ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{running ? `${state.done}/${state.total}` : "Wiki"}</span>
    </button>
  );
}
