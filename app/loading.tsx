// app/loading.tsx
export default function Loading() {
  return (
    <>

      <section className="border-b border-[#2a302b] bg-[radial-gradient(circle_at_75%_15%,#394931_0%,transparent_30%),linear-gradient(135deg,#182019_0%,#101211_60%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:px-12 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 h-3 w-56 animate-pulse rounded-sm bg-[#2a302b]" />
            <div className="h-16 w-full max-w-xl animate-pulse rounded-sm bg-[#1c211d] sm:h-20" />
            <div className="mt-9 h-11 max-w-xl animate-pulse rounded-sm bg-[#1c211d]" />
          </div>

          <div className="min-h-[360px] animate-pulse border border-[#2a302b] bg-[#1c211d] lg:min-h-[470px]" />
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
        <div className="h-3 w-24 animate-pulse rounded-sm bg-[#2a302b]" />
        <div className="mt-3 h-9 w-40 animate-pulse rounded-sm bg-[#1c211d]" />

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-24 shrink-0 animate-pulse border border-[#2a302b] bg-[#171b18]" />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-16 shrink-0 animate-pulse border border-[#2a302b] bg-[#171b18]" />
          ))}
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/3] animate-pulse bg-[#252c25]" />
              <div className="border-b border-[#2d342e] py-4">
                <div className="h-6 w-3/4 animate-pulse rounded-sm bg-[#1c211d]" />
                <div className="mt-2 h-4 w-1/3 animate-pulse rounded-sm bg-[#171b18]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
