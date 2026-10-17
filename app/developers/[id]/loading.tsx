export default function Loading() {
  return (
    <div aria-busy="true" className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
      <p className="sr-only" role="status">Loading developer details...</p>

      <section aria-hidden="true" className="mt-10 border-b border-game-border-faint pb-10">
        <div className="h-3 w-24 animate-pulse rounded-sm bg-game-border-faint" />
        <div className="mt-4 h-14 w-full max-w-2xl animate-pulse rounded-sm bg-game-surface-muted sm:h-20" />
        <div className="mt-5 h-4 w-20 animate-pulse rounded-sm bg-game-border-faint" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full max-w-3xl animate-pulse rounded-sm bg-game-surface-muted" />
          <div className="h-4 w-11/12 max-w-3xl animate-pulse rounded-sm bg-game-surface-muted" />
          <div className="h-4 w-4/5 max-w-3xl animate-pulse bg-game-surface-muted" />
        </div>
        <div className="mt-6 h-4 w-28 animate-pulse rounded-sm bg-game-surface-muted" />
      </section>

      <section aria-hidden="true" className="pt-10">
        <div className="h-10 w-72 max-w-full animate-pulse rounded-sm bg-game-surface-muted" />
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index}>
              <div className="aspect-[4/3] animate-pulse bg-game-surface-image" />
              <div className="border-b border-game-border-muted py-4">
                <div className="h-6 w-3/4 animate-pulse rounded-sm bg-game-surface-muted" />
                <div className="mt-2 h-4 w-1/3 animate-pulse rounded-sm bg-game-surface" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
