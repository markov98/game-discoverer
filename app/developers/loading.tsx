export default function Loading() {
  return (
    <div aria-busy="true">
      <p className="sr-only" role="status">Loading developers...</p>

      <section
        aria-hidden="true"
        className="border-b border-game-border-faint bg-[radial-gradient(circle_at_75%_15%,var(--game-hero-glow)_0%,transparent_30%),linear-gradient(135deg,var(--game-hero-start)_0%,var(--game-background)_60%)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
          <div className="mb-5 h-3 w-56 animate-pulse rounded-sm bg-game-border-faint" />
          <div className="h-16 w-full max-w-xl animate-pulse rounded-sm bg-game-surface-muted sm:h-20" />


          <div className="mt-9 h-11 max-w-xl animate-pulse rounded-sm bg-game-surface-muted" />
        </div>
      </section>

      <section id="developers" aria-busy="true" className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-game-border-faint pb-4">
          <div className="h-9 w-64 max-w-full animate-pulse rounded-sm bg-game-surface-muted" />
          <div className="h-4 w-28 animate-pulse rounded-sm bg-game-border-faint" />
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading developers">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="flex min-h-48 flex-col justify-between border border-game-border-faint bg-game-surface"
              key={index}
            >
              <div className="h-36 animate-pulse bg-game-surface-image" />
              <div className="flex items-end justify-between gap-4 px-5 pb-5">
                <div className="h-7 w-2/3 animate-pulse rounded-sm bg-game-surface-muted" />
                <div className="h-3 w-16 animate-pulse rounded-sm bg-game-border-faint" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
