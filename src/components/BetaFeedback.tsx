"use client";

import { useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bug, FlaskConical, Lightbulb, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FeedbackType = "bug" | "feature" | "other";

const REPO_ISSUES_NEW =
  "https://github.com/Brandon1212b/osrs-item-tracker/issues/new";

function buildIssueBody(opts: {
  type: FeedbackType;
  title: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  contact: string;
  pageUrl: string;
  path: string;
  search: string;
  userAgent: string;
  viewport: string;
}) {
  const lines: string[] = [];

  lines.push("## Summary");
  lines.push(opts.description.trim() || "_(no description)_");
  lines.push("");

  if (opts.type === "bug") {
    if (opts.steps.trim()) {
      lines.push("## Steps to reproduce");
      lines.push(opts.steps.trim());
      lines.push("");
    }
    if (opts.expected.trim()) {
      lines.push("## Expected");
      lines.push(opts.expected.trim());
      lines.push("");
    }
    if (opts.actual.trim()) {
      lines.push("## Actual");
      lines.push(opts.actual.trim());
      lines.push("");
    }
  }

  lines.push("## Context (auto-captured)");
  lines.push(`- **Type:** ${opts.type}`);
  lines.push(`- **Page:** ${opts.pageUrl || "(unknown)"}`);
  lines.push(`- **Path:** \`${opts.path || "/"}\``);
  if (opts.search) lines.push(`- **Search params:** \`${opts.search}\``);
  lines.push(`- **Viewport:** ${opts.viewport}`);
  lines.push(`- **User agent:** ${opts.userAgent || "(unknown)"}`);
  lines.push(`- **Submitted:** ${new Date().toISOString()}`);
  if (opts.contact.trim()) {
    lines.push(`- **Contact:** ${opts.contact.trim()}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("_Submitted via in-app beta feedback form._");

  return lines.join("\n");
}

export function BetaFeedback() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const routerState = useRouterState();
  const location = routerState.location;

  const context = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        pageUrl: "",
        path: location.pathname,
        search: location.searchStr ?? "",
        userAgent: "",
        viewport: "",
      };
    }
    return {
      pageUrl: window.location.href,
      path: location.pathname,
      search: location.searchStr ?? window.location.search,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}×${window.innerHeight} (dpr ${window.devicePixelRatio || 1})`,
    };
  }, [location.pathname, location.searchStr, open]);

  const canSubmit = title.trim().length >= 3 && description.trim().length >= 10;

  const resetForm = () => {
    setType("bug");
    setTitle("");
    setDescription("");
    setSteps("");
    setExpected("");
    setActual("");
    setContact("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const body = buildIssueBody({
      type,
      title: title.trim(),
      description,
      steps,
      expected,
      actual,
      contact,
      ...context,
    });

    const labels =
      type === "bug"
        ? "beta-feedback,bug"
        : type === "feature"
          ? "beta-feedback,enhancement"
          : "beta-feedback";

    const params = new URLSearchParams({
      title: `[Beta] ${title.trim()}`,
      body,
      labels,
    });

    const url = `${REPO_ISSUES_NEW}?${params.toString()}`;

    // Open GitHub issue form so requests land in the repo Issues list
    window.open(url, "_blank", "noopener,noreferrer");

    setSubmitting(false);
    setOpen(false);
    resetForm();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-3 top-3 z-50 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary shadow-sm backdrop-blur transition-colors hover:bg-primary/25 sm:right-4 sm:top-4"
        aria-label="Beta feedback — report a bug or request a feature"
        title="Beta — report a bug or request a feature"
      >
        <FlaskConical className="size-3.5" />
        Beta
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="size-5 text-primary" />
              Beta feedback
            </DialogTitle>
            <DialogDescription>
              Report a bug or request a feature. Your current page and device info are included
              automatically so we can reproduce and prioritize it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as FeedbackType)}
              >
                <SelectTrigger id="feedback-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">
                    <span className="inline-flex items-center gap-2">
                      <Bug className="size-3.5" /> Bug report
                    </span>
                  </SelectItem>
                  <SelectItem value="feature">
                    <span className="inline-flex items-center gap-2">
                      <Lightbulb className="size-3.5" /> Feature request
                    </span>
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="feedback-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  type === "bug"
                    ? "e.g. Prices stuck loading on skilling tab"
                    : "e.g. Add filtering by quest requirements"
                }
                maxLength={120}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="feedback-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What happened or what would you like to see? Be as specific as you can."
                className="min-h-[88px]"
                required
              />
            </div>

            {type === "bug" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="feedback-steps">Steps to reproduce</Label>
                  <Textarea
                    id="feedback-steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder={"1. Go to…\n2. Click…\n3. See error"}
                    className="min-h-[72px]"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="feedback-expected">Expected</Label>
                    <Textarea
                      id="feedback-expected"
                      value={expected}
                      onChange={(e) => setExpected(e.target.value)}
                      placeholder="What should have happened"
                      className="min-h-[64px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback-actual">Actual</Label>
                    <Textarea
                      id="feedback-actual"
                      value={actual}
                      onChange={(e) => setActual(e.target.value)}
                      placeholder="What actually happened"
                      className="min-h-[64px]"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="feedback-contact">Contact (optional)</Label>
              <Input
                id="feedback-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="RSN, Discord, or email if you want a reply"
              />
            </div>

            <div className="rounded-md border border-border/60 bg-secondary/20 px-3 py-2 text-[11px] text-muted-foreground">
              <p className="font-medium text-foreground/80">Auto-captured for this report</p>
              <ul className="mt-1 space-y-0.5 font-mono">
                <li className="truncate" title={context.pageUrl}>
                  {context.path}
                  {context.search || ""}
                </li>
                <li>{context.viewport || "—"}</li>
              </ul>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit || submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Opening…
                  </>
                ) : (
                  "Open GitHub issue"
                )}
              </Button>
            </DialogFooter>

            <p className="text-center text-[11px] text-muted-foreground">
              Opens a pre-filled GitHub issue so every request is tracked in one place.{" "}
              <a
                href="https://github.com/Brandon1212b/osrs-item-tracker/issues"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                View all feedback
              </a>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
