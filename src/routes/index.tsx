import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GE Watch — OSRS Gear Prices & Skilling Methods" },
      {
        name: "description",
        content:
          "GE Watch is for regular Old School RuneScape players. Check live gear prices when you want an upgrade, and compare wiki training methods by XP, GP, and your own money-making rate.",
      },
      { property: "og:title", content: "GE Watch — OSRS Gear Prices & Skilling Methods" },
      {
        property: "og:description",
        content:
          "Not a flipping site. Live GE prices for wiki gear, plus skilling methods ranked against what your time is worth.",
      },
    ],
  }),
  component: LandingPage,
});

function StoneButton({ lines }: { lines: [string, string] | [string] }) {
  return (
    <span className="rs-stone-btn" aria-hidden>
      <span className="rs-stone-btn-face">
        <span className="rs-stone-btn-label">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

function LandingPage() {
  return (
    <main className="rs-landing">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 sm:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
          GE Watch
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold leading-tight sm:text-3xl">
          Tools for regular OSRS players
        </h1>
        <p className="mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          This site is not for flipping. It is for buying the gear you actually wear when the
          Grand Exchange is cheap, and for picking a training method that is worth your time
          instead of just looking at raw XP/hr.
        </p>

        <div className="mt-8 flex w-full flex-row items-start justify-center gap-3 sm:mt-10 sm:gap-10">
          <Link
            to="/items"
            search={{}}
            className="group flex flex-1 flex-col items-center text-center outline-none"
          >
            <StoneButton lines={["Item", "Prices"]} />
            <h2 className="mt-4 text-base font-semibold text-foreground">Item Prices</h2>
            <p className="mt-1.5 max-w-[18rem] text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Live GE prices for wiki gear progression, skilling items, and supplies. Starts on
              Gear. Filter by melee / ranged / magic, paper-doll slot, and wiki stage. Open any
              item for a chart with high/low dots and a buy signal for the range you pick.
            </p>
          </Link>

          <Link
            to="/methods"
            search={{}}
            className="group flex flex-1 flex-col items-center text-center outline-none"
          >
            <StoneButton lines={["Skilling", "Methods"]} />
            <h2 className="mt-4 text-base font-semibold text-foreground">Skilling Methods</h2>
            <p className="mt-1.5 max-w-[18rem] text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Wiki-style training methods with live input and output prices. Compare XP/hr and
              GP/hr, then rank by your money-making rate so a method that profits can beat a
              faster-but-expensive one. Load your RSN to hide methods above your level.
            </p>
          </Link>
        </div>

        <p className="mt-10 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground">
          Prices come from the OSRS Wiki real-time Grand Exchange API. Not affiliated with Jagex.
        </p>
      </div>
    </main>
  );
}
