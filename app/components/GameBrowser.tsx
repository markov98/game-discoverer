import type { Game } from "../lib/types";
import Link from "next/link";
import { formatReleaseDate } from "../lib/formatters";

export function Search({ genre, platform, query }: { genre: string; platform: string; query: string }) {
  return (
    <form
      className="mt-9 flex max-w-xl items-center gap-2 border-b border-[#657061] pb-3 focus-within:border-[#d7a94b]"
      action="/"
      method="get"
    >
      <input
        aria-label="Search games"
        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#f8f5ed] outline-none placeholder:text-[#7f897e]"
        placeholder="Search for a game"
        type="search"
        name="search"
        defaultValue={query}
      />
      {genre && <input type="hidden" name="genre" value={genre} />}
      {platform && <input type="hidden" name="platform" value={platform} />}
      <button className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7a94b] transition hover:text-[#f3c66a]" type="submit">
        Search
      </button>
    </form>
  );
}

function GameBrowser({
  currentPage,
  error,
  genre,
  games,
  platform,
  search,
  totalPages,
}: {
  currentPage: number;
  error?: string | null;
  genre: string;
  games: Game[];
  platform: string;
  search: string;
  totalPages: number;
}) {
  const gridGames = games;
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre) params.set("genre", genre);
    if (platform) params.set("platform", platform);
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
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Game genres">
        {[
          { label: "All games", value: "" },
          { label: "Action", value: "action" },
          { label: "Adventure", value: "adventure" },
          { label: "Indie", value: "indie" },
          { label: "RPG", value: "role-playing-games-rpg" },
          { label: "Strategy", value: "strategy" },
          { label: "Simulation", value: "simulation" },
          { label: "Sports", value: "sports" },
          { label: "Racing", value: "racing" },
          { label: "Puzzle", value: "puzzle" },
          { label: "Shooter", value: "shooter" },
          { label: "Horror", value: "horror" },
          { label: "Fighting", value: "fighting" },
        ].map((item) => {
          const params = new URLSearchParams();
          if (search) params.set("search", search);
          if (item.value) params.set("genre", item.value);
          if (item.value || search) params.set("page", "1");

          return (
            <a
              className={`whitespace-nowrap border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${genre === item.value ? "border-[#d7a94b] bg-[#d7a94b] text-[#151812]" : "border-[#343d35] text-[#9da79a] hover:border-[#d7a94b] hover:text-[#f8f5ed]"}`}
              href={params.toString() ? `/?${params.toString()}` : "/"}
              key={item.value || "all"}
            >
              {item.label}
            </a>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" aria-label="Game platforms">
        <span className="mr-2 self-center text-xs font-bold uppercase tracking-[0.12em] text-[#657061]">Platform</span>
        {[
          { label: "All", value: "" },
          { label: "PC", value: "4" },
          { label: "PlayStation 5", value: "187" },
          { label: "Xbox Series", value: "186" },
          { label: "Switch", value: "7" },
          { label: "PlayStation 4", value: "18" },
          { label: "Xbox One", value: "1" },
          { label: "iOS", value: "3" },
          { label: "Android", value: "21" },
        ].map((item) => {
          const params = new URLSearchParams();
          if (search) params.set("search", search);
          if (genre) params.set("genre", genre);
          if (item.value) params.set("platform", item.value);
          if (item.value || genre || search) params.set("page", "1");

          return (
            <a
              className={`whitespace-nowrap border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition ${platform === item.value ? "border-[#d7a94b] bg-[#d7a94b] text-[#151812]" : "border-[#343d35] text-[#9da79a] hover:border-[#d7a94b] hover:text-[#f8f5ed]"}`}
              href={params.toString() ? `/?${params.toString()}` : "/"}
              key={item.value || "all"}
            >
              {item.label}
            </a>
          );
        })}
      </div>

      {error ? (
        <div className="mt-10 border border-dashed border-[#465146] bg-[#171b18] px-6 py-16 text-center">
          <p className="font-serif text-2xl text-[#f8f5ed]">{error}</p>
        </div>
      ) : gridGames.length > 0 ? (
        <div id="trending" className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {gridGames.map((game, index) => (
            <Link className="group" href={`/games/${game.id}`} key={game.id}>
              <article>
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
            </Link>
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