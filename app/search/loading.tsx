export default function Loading() {
  return (
    <section className="border-b border-game-border-faint bg-[radial-gradient(circle_at_75%_15%,var(--game-hero-glow)_0%,transparent_30%),linear-gradient(135deg,var(--game-hero-start)_0%,var(--game-background)_60%)]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
        <div className="h-3 w-28 animate-pulse rounded-sm bg-game-border-faint" />
        <div className="mt-3 h-12 w-64 max-w-full animate-pulse rounded-sm bg-game-surface-muted sm:h-14" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-sm bg-game-surface-muted" />

        <div className="mt-8 grid gap-5 border-t border-game-border-strong pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="h-3 w-24 animate-pulse rounded-sm bg-game-border-faint" />
            <div className="mt-2 h-11 animate-pulse border border-game-border-faint bg-game-surface" />
          </div>
          <div>
            <div className="h-3 w-16 animate-pulse rounded-sm bg-game-border-faint" />
            <div className="mt-2 h-44 animate-pulse border border-game-border-faint bg-game-surface" />
          </div>
          <div>
            <div className="h-3 w-20 animate-pulse rounded-sm bg-game-border-faint" />
            <div className="mt-2 h-11 animate-pulse border border-game-border-faint bg-game-surface" />
          </div>
          <div>
            <div className="h-3 w-12 animate-pulse rounded-sm bg-game-border-faint" />
            <div className="mt-2 h-44 animate-pulse border border-game-border-faint bg-game-surface" />
          </div>
          <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-4">
            <div className="h-11 w-32 animate-pulse bg-game-surface-muted" />
            <div className="h-4 w-24 animate-pulse bg-game-border-faint" />
          </div>
        </div>
      </div>
    </section>
  );
}