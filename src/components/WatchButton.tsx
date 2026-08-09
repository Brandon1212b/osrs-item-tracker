import { Star } from "lucide-react";
import { toast } from "sonner";
import { useWatchlist, useWatchlistMutations } from "@/lib/watchlist";

export function WatchButton({
  itemId,
  itemName,
  className = "",
}: {
  itemId: number;
  itemName: string;
  className?: string;
}) {
  const watchlist = useWatchlist();
  const { add, remove } = useWatchlistMutations();

  const entry = watchlist.data?.find((w) => w.item_id === itemId);
  const busy = add.isPending || remove.isPending;

  return (
    <button
      type="button"
      aria-label={entry ? `Stop tracking ${itemName}` : `Track ${itemName}`}
      title={entry ? "Remove from watchlist" : "Add to watchlist"}
      disabled={busy}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (entry) {
          remove.mutate(entry.id, { onSuccess: () => toast(`Removed ${itemName}`) });
        } else {
          add.mutate(
            { itemId, itemName },
            { onSuccess: () => toast(`Tracking ${itemName}`) },
          );
        }
      }}
      className={`inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 ${className}`}
    >
      <Star className={`size-4 ${entry ? "fill-[var(--gold,#d4a12a)] text-[var(--gold,#d4a12a)]" : ""}`} />
    </button>
  );
}
