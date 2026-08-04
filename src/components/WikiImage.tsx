import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

const WIKI_IMG_BASE = "https://oldschool.runescape.wiki/images/";

/** Normalize API / catalog icon names to wiki filenames (spaces → underscores). */
export function toWikiFilename(icon: string, ensurePng = false): string {
  let filename = icon.replace(/ /g, "_");
  if (ensurePng && !/\.png$/i.test(filename)) {
    filename += ".png";
  }
  return filename;
}

export function wikiIconUrl(icon: string, ensurePng = false): string {
  return `${WIKI_IMG_BASE}${encodeURIComponent(toWikiFilename(icon, ensurePng))}`;
}

type WikiImageProps = {
  /** Filename from the prices mapping API (e.g. "Abyssal_whip.png") or a wiki icon name. */
  icon: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  /** Prefer false for always-visible UI chrome (paper doll, skill tabs, bonus icons). */
  lazy?: boolean;
  /** Append .png when the name has no extension (slot / skill icons already include it). */
  ensurePng?: boolean;
  draggable?: boolean;
};

/**
 * Reliable OSRS Wiki icon loader.
 *
 * - referrerPolicy="no-referrer" avoids intermittent blocks from the wiki CDN / Safari privacy features
 * - Retries (with cache-buster) recover from cancelled lazy loads on mobile scroll / list remounts
 * - Soft placeholder when the image ultimately fails so the layout never shows a broken icon
 * - Always object-contain inside the given box so varying wiki icon padding/aspect still fills consistently
 */
export function WikiImage({
  icon,
  alt = "",
  className,
  width,
  height,
  lazy = true,
  ensurePng = false,
  draggable = false,
}: WikiImageProps) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  const base = wikiIconUrl(icon, ensurePng);
  const src = attempt > 0 ? `${base}?r=${attempt}` : base;

  const handleError = useCallback(() => {
    if (attempt < 2) {
      setAttempt((a) => a + 1);
    } else {
      setFailed(true);
    }
  }, [attempt]);

  if (failed || !icon) {
    return (
      <span
        className={cn("inline-block shrink-0 rounded-sm bg-muted/50", className)}
        style={{
          width: width ?? undefined,
          height: height ?? undefined,
        }}
        aria-hidden
      />
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={draggable}
      onError={handleError}
      className={cn("object-contain", className)}
      style={{
        // Ensure the laid-out box is respected even when the source PNG is
        // small or heavily padded (common for bars vs ores).
        maxWidth: width ? `${width}px` : undefined,
        maxHeight: height ? `${height}px` : undefined,
      }}
    />
  );
}
