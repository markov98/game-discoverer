import type { Game } from "../lib/types";

function formatReleaseDate(released?: string | null) {
  if (!released) return "Coming soon";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(released));
}

export function Search({ query }: { query: string }) {
  return (
    <form
      className="mt-9 flex max-w-xl items-center gap-2 border-b border-[#657061] pb-3 focus-within:border-[#d7a94b]"
      action="/"
      method="get"
    >
      <span className="text-xl text-[#d7a94b]" aria-hidden="true">?</span>
      <input
        aria-label="Search games"
        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#f8f5ed] outline-none placeholder:text-[#7f897e]"
        placeholder="Search for a game, genre, or mood"
        type="search"
        name="search"
        defaultValue={query}
      />
      <button className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7a94b] transition hover:text-[#f3c66a]" type="submit">
        Search
      </button>
    </form>
  );
}

function GameBrowser({
  currentPage,
  games,
  search,
  totalPages,
}: {
  currentPage: number;
  games: Game[];
  search: string;
  totalPages: number;
}) {
  const gridGames = currentPage === 1 ? games.slice(1) : games;
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    return `/?${params.toString()}`;
  };

  return (
    <section id="discover" className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d7a94b]">The library</p>
          <h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[#f8f5ed]">Explore</h2>
        </div>
        <p className="text-sm text-[#7f897e]">{games.length} {games.length === 1 ? "game" : "games"} found</p>
      </div>

      {gridGames.length > 0 ? (
        <div id="trending" className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {gridGames.map((game, index) => (
            <article className="group" key={game.id}>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#252c25]">
                <img alt={game.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={game.background_image ?? ""} />
                <span className="absolute left-4 top-4 bg-[#101211]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7a94b]">0{index + 1}</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-[#2d342e] py-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#f8f5ed]">{game.name}</h3>
                  <p className="mt-1 text-sm text-[#7f897e]">{formatReleaseDate(game.released)}</p>
                </div>
                <span className="pt-1 text-sm text-[#d7a94b]">* {game.rating?.toFixed(1) ?? "-"}</span>
              </div>
            </article>
          ))}
        </div>
      ) : games.length === 1 && currentPage === 1 ? null : (
        <div className="mt-10 border border-dashed border-[#465146] px-6 py-16 text-center">
          <p className="font-serif text-2xl text-[#f8f5ed]">No games match that search.</p>
          <p className="mt-2 text-sm text-[#7f897e]">Try a different title or clear the search field.</p>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <a
              className="border border-[#343d35] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#c3cabe] transition hover:border-[#d7a94b] hover:text-white"
              href={pageHref(currentPage - 1)}
            >
              Previous
            </a>
          )}
          <span className="px-4 text-sm text-[#7f897e]">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <a
              className="border border-[#d7a94b] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d7a94b] transition hover:bg-[#d7a94b] hover:text-[#151812]"
              href={pageHref(currentPage + 1)}
            >
              Next
            </a>
          )}
        </nav>
      )}
    </section>
  );
}

export default GameBrowser;