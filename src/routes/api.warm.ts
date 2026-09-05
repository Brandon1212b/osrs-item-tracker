import { createFileRoute } from "@tanstack/react-router";
import { CATALOG } from "@/lib/osrs-catalog";
import "@/lib/catalog-pvm-additions";

export const Route = createFileRoute("/api/warm")({
  server: {
    handlers: {
      GET: async () => {
        const { getSnapshot, getTrends, getItemRequirementsMap } = await import("@/lib/osrs.server");
        const names = CATALOG.flatMap((g) => g.items.map((i) => i.name));
        const started = Date.now();
        const rows = await getSnapshot(names);
        const trends = await getTrends(names, "6m");
        await getItemRequirementsMap(names);
        return Response.json({
          ok: true,
          items: rows.length,
          trends: Object.keys(trends).length,
          ms: Date.now() - started,
        });
      },
    },
  },
});
