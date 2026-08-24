import { Link } from "@tanstack/react-router";
import { ChartLine, Pickaxe } from "lucide-react";
import type { ReactNode } from "react";

function ToolLink({
  to,
  title,
  subtitle,
  icon,
  exact,
}: {
  to: "/" | "/methods";
  title: string;
  subtitle: string;
  icon: ReactNode;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      search={{} as never}
      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors sm:px-3 sm:py-2"
      activeProps={{
        className:
          "flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-primary/15 px-2.5 py-1.5 text-left ring-1 ring-primary/40 transition-colors sm:px-3 sm:py-2",
      }}
      activeOptions={{ exact: exact ?? false, includeSearch: false }}
      inactiveProps={{
        className:
          "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground sm:px-3 sm:py-2",
      }}
    >
      <span className="hidden shrink-0 text-current sm:inline-flex">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold leading-tight sm:text-sm">{title}</span>
        <span className="mt-0.5 block truncate text-[10px] leading-tight text-muted-foreground sm:text-[11px]">
          {subtitle}
        </span>
      </span>
    </Link>
  );
}

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <Link
          to="/"
          search={{} as never}
          className="shrink-0 font-display text-sm font-semibold tracking-wide text-foreground sm:text-base"
        >
          GE Watch
        </Link>

        {/* Two distinct tools — segmented switcher */}
        <div className="flex min-w-0 flex-1 items-stretch gap-0.5 rounded-xl border border-border/60 bg-secondary/25 p-0.5 sm:max-w-md sm:gap-1 sm:p-1">
          <ToolLink
            to="/"
            exact
            title="Item Prices"
            subtitle="Live GE prices & charts"
            icon={<ChartLine className="size-4" />}
          />
          <ToolLink
            to="/methods"
            title="Skilling Methods"
            subtitle="XP/hr · cost vs your rate"
            icon={<Pickaxe className="size-4" />}
          />
        </div>
      </nav>
    </header>
  );
}
