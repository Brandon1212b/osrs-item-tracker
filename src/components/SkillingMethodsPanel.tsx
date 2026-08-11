import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, CircleHelp, Pin, PinOff, Star } from "lucide-react";
import { toast } from "sonner";
import { useWatchlistMutations } from "@/lib/watchlist";
import { deriveIntensity, intensityClass, MONEY_PRESETS } from "@/components/methods-ux";
// NOTE: Full panel body is large — this commit is a loader stub that will be replaced.
// See PR discussion for the complete SkillingMethodsPanel.tsx content.
export { SkillingMethodsPanel } from "./SkillingMethodsPanel.impl";
