import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <Link to="/" search={{} as never} className="font-display text-sm font-semibold tracking-wide text-foreground sm:text-base">
          GE Watch
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            to="/watchlist"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:text-sm"
            activeProps={{ className: "text-foreground bg-accent" }}
          >
            <Star className="size-4" />
            Watchlist
          </Link>
        </div>
      </nav>
    </header>
  );
}
