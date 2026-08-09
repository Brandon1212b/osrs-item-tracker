import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

const navLinkClass =
  "inline-flex shrink-0 items-center rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:px-2.5 sm:text-sm";
const navInactive = `${navLinkClass} text-muted-foreground hover:bg-accent hover:text-foreground`;
const navActive = `${navLinkClass} bg-accent text-foreground`;

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <Link
          to="/"
          search={{} as never}
          className="shrink-0 font-display text-sm font-semibold tracking-wide text-foreground sm:text-base"
        >
          GE Watch
        </Link>
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1.5">
          <Link
            to="/"
            search={{} as never}
            className={navInactive}
            activeProps={{ className: navActive }}
            activeOptions={{ exact: true, includeSearch: false }}
          >
            Item Prices
          </Link>
          <Link
            to="/methods"
            search={{} as never}
            className={navInactive}
            activeProps={{ className: navActive }}
            activeOptions={{ includeSearch: false }}
          >
            Skilling Methods
          </Link>
          <Link
            to="/watchlist"
            className={`${navInactive} gap-1.5`}
            activeProps={{ className: `${navActive} gap-1.5` }}
          >
            <Star className="size-3.5 sm:size-4" />
            Watchlist
          </Link>
        </div>
      </nav>
    </header>
  );
}
