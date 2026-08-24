import { Link } from "@tanstack/react-router";
import { ChartLine, Pickaxe } from "lucide-react";
import type { ReactNode } from "react";

const linkBase =
  "inline-flex items-center gap-1.5 border-b-2 px-1 py-2.5 text-sm font-medium transition-colors sm:gap-2 sm:px-1.5";
const linkInactive = `${linkBase} border-transparent text-muted-foreground hover:text-foreground`;
const linkActive = `${linkBase} border-primary text-foreground`;

function NavLink({
  to,
  label,
  icon,
  exact,
}: {
  to: "/" | "/methods";
  label: string;
  icon: ReactNode;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      search={{} as never}
      className={linkInactive}
      activeProps={{ className: linkActive }}
      activeOptions={{ exact: exact ?? false, includeSearch: false }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-3 sm:gap-6 sm:px-4">
        <Link
          to="/"
          search={{} as never}
          className="shrink-0 py-2.5 font-display text-sm font-semibold tracking-wide text-foreground sm:text-base"
        >
          GE Watch
        </Link>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <NavLink
            to="/"
            exact
            label="Item Prices"
            icon={<ChartLine className="size-4 shrink-0" aria-hidden />}
          />
          <NavLink
            to="/methods"
            label="Skilling Methods"
            icon={<Pickaxe className="size-4 shrink-0" aria-hidden />}
          />
        </div>
      </nav>
    </header>
  );
}
