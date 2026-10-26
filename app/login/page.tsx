import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | GameDiscoverer",
};

export default function LoginPage() {
  return (
    <section className="border-b border-game-border-faint bg-[radial-gradient(circle_at_75%_15%,var(--game-hero-glow)_0%,transparent_30%),linear-gradient(135deg,var(--game-hero-start)_0%,var(--game-background)_60%)]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">Welcome back</p>
        <h1 className="mt-3 font-serif text-4xl text-game-text sm:text-5xl">Log in</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-game-text-dim">
          Sign in to your GameDiscoverer account.
        </p>

        <div className="mt-9 grid max-w-xl gap-5 border-t border-game-border-strong pt-6">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
            Email
            <input
              autoComplete="email"
              className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent"
              name="email"
              type="email"
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
            Password
            <input
              autoComplete="current-password"
              className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent"
              name="password"
              type="password"
            />
          </label>
          <button
            className="justify-self-start border border-game-accent bg-game-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-game-ink transition hover:bg-game-accent-hover"
            type="button"
          >
            Log in
          </button>
        </div>
      </div>
    </section>
  );
}
