export default function Loading() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="h-3 w-32 animate-pulse rounded-sm bg-game-border-faint" />

        <section className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="aspect-[4/3] animate-pulse bg-game-surface-image" />

          <div>
            <div className="h-3 w-28 animate-pulse rounded-sm bg-game-border-faint" />
            <div className="mt-4 h-14 w-full max-w-2xl animate-pulse rounded-sm bg-game-surface-muted sm:h-20" />
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="h-4 w-24 animate-pulse rounded-sm bg-game-border-faint" />
              <div className="h-4 w-32 animate-pulse rounded-sm bg-game-border-faint" />
              <div className="h-4 w-28 animate-pulse rounded-sm bg-game-border-faint" />
            </div>
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-sm bg-game-surface-muted" />
              <div className="h-4 w-11/12 animate-pulse rounded-sm bg-game-surface-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded-sm bg-game-surface-muted" />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-8 w-20 animate-pulse border border-game-border-faint bg-game-surface" />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="h-11 w-36 animate-pulse border border-game-border-faint bg-game-surface" />
              <div className="h-11 w-28 animate-pulse border border-game-border-faint bg-game-surface" />
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-game-border-faint pt-10">
          <div className="h-10 w-48 animate-pulse rounded-sm bg-game-surface-muted" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-video animate-pulse bg-game-surface-image" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
