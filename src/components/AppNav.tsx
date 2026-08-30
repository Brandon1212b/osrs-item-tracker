import { Link, useRouterState } from "@tanstack/react-router";
import { ChartLine, Pickaxe, Star } from "lucide-react";
import type { ComponentType } from "react";

import { useWatchlist } from "@/lib/watchlist";

type TabTo = "/" | "/methods" | "/watchlist";

type Tab = {
  to: TabTo;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  match: (pathname: string) => boolean;
};

const TABS: Tab[] = [
  {
    to: "/",
    label: "Prices",
    Icon: ChartLine,
    match: (p) => p === "/" || p.startsWith("/item"),
  },
  {
    to: "/methods",
    label: "Methods",
    Icon: Pickaxe,
    match: (p) => p.startsWith("/methods"),
  },
  {
    to: "/watchlist",
    label: "Watchlist",
    Icon: Star,
    match: (p) => p.startsWith("/watchlist") || p.startsWith("/auth"),
  },
];

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const watchlist = useWatchlist();
  const watchCount = watchlist.data?.length ?? 0;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Primary"
    >
      <div className="tab-bar-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden />
      <div className="pointer-events-auto relative flex w-full max-w-[22.5rem] items-stretch gap-0.5 rounded-[28px] border border-white/10 bg-card/75 px-1.5 py-1.5 shadow-[0_10px_40px_-12px_oklch(0_0_0/0.7)] backdrop-blur-2xl supports-[backdrop-filter]:bg-card/60">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const showBadge = tab.to === "/watchlist" && watchCount > 0;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              search={{} as never}
              aria-current={active ? "page" : undefined}
              aria-label={showBadge ? `${tab.label}, ${watchCount} saved` : tab.label}
              onClick={() => {
                if (active) {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`relative flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 transition-colors ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <tab.Icon className="size-[22px] shrink-0" aria-hidden strokeWidth={active ? 2.25 : 1.85} />
              <span className="text-[10px] font-semibold leading-none tracking-wide">{tab.label}</span>
              {showBadge && (
                <span className="absolute right-2.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold tabular-nums text-primary-foreground">
                  {watchCount > 99 ? "99+" : watchCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
