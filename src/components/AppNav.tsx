import { Link, useRouterState } from "@tanstack/react-router";
import { ChartLine, Home, Pickaxe } from "lucide-react";
import type { ReactNode } from "react";

const linkBase =
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:gap-2 sm:px-3";
const linkInactive = `${linkBase} text-muted-foreground hover:bg-secondary/60 hover:text-foreground`;
const linkActive = `${linkBase} bg-primary text-primary-foreground shadow-sm`;

function NavLink({
  to,
  label,
  icon,
  active,
}: {
  to: "/" | "/methods";
  label: string;
  icon: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      search={{} as never}
      className={active ? linkActive : linkInactive}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onMethods = pathname.startsWith("/methods");
  // Item Prices covers home grid and individual item pages
  const onPrices = !onMethods;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <Link
          to="/"
          search={{} as never}
          aria-label="Home"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <Home className="size-4" />
        </Link>

        <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          <NavLink
            to="/"
            label="Item Prices"
            active={onPrices}
            icon={<ChartLine className="size-4 shrink-0" aria-hidden />}
          />
          <NavLink
            to="/methods"
            label="Skilling Methods"
            active={onMethods}
            icon={<Pickaxe className="size-4 shrink-0" aria-hidden />}
          />
        </div>
      </nav>
    </header>
  );
}
