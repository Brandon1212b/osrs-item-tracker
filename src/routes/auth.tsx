import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log in — GE Watch OSRS price tracker" },
      {
        name: "description",
        content: "Sign in to save your OSRS watchlist, RSN and price-drop alerts across devices.",
      },
      { property: "og:title", content: "Log in — GE Watch OSRS price tracker" },
      {
        property: "og:description",
        content: "Sign in with Google to keep your tracked OSRS items and alerts synced.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && signedIn) navigate({ to: "/watchlist", replace: true });
  }, [loading, signedIn, navigate]);

  async function signIn() {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Could not sign in. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/watchlist", replace: true });
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="panel w-full max-w-sm p-6 text-center">
        <h1 className="font-display text-xl font-semibold text-foreground">Save your watchlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Log in to keep your tracked items, price targets and RSN synced on every device.
        </p>
        <button
          onClick={signIn}
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          Continue with Google
        </button>
        {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
      </div>
    </main>
  );
}
