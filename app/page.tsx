import GameBrowser, { Search } from "@/app/components/GameBrowser";
import type { Metadata } from "next";
import { fetchGamesPage } from "./lib/games";
import { formatReleaseDate } from "./lib/formatters";

const pageSize = 12;

export const metadata: Metadata = {
  title: "Discover games | GameDiscoverer",
};

async function getDiscoverGames(query: string, genre: string, platform: string, page: number) {
  try {
    const data = await fetchGamesPage(query, page, pageSize, undefined, genre, platform);
    return { games: data.results, total: data.count, error: null };
  } catch {
    return { games: [], total: 0, error: "API Problem, please try again later." };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; genre?: string; platform?: string; page?: string }>;
}) {
  const { search = "", genre = "", platform = "", page: pageParam = "1" } = await searchParams;
  const requestedPage = Number.parseInt(pageParam, 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { games, total, error } = await getDiscoverGames(search, genre, platform, currentPage);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const featuredGame = games[0];

  return (
    <main id="top" className="min-h-screen bg-[#101211] text-[#f4f1e8]">
      <section className="border-b border-[#2a302b] bg-[radial-gradient(circle_at_75%_15%,#394931_0%,transparent_30%),linear-gradient(135deg,#182019_0%,#101211_60%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:px-12 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#d7a94b]">
              Find your next gaming adventure
            </p>
            <h1 className="max-w-2xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-[#f8f5ed] sm:text-7xl">
              Follow your curiosity.
            </h1>
            <Search genre={genre} platform={platform} query={search} />
          </div>

          {featuredGame && (
            <article className="group relative min-h-[360px] overflow-hidden border border-[#66705f] bg-[#252c25] shadow-2xl shadow-black/20 lg:min-h-[470px]">
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105"
                src={featuredGame.background_image ?? ""}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101211] via-[#101211]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7a94b]">Featured pick</p>
                <h2 className="mt-2 font-serif text-4xl text-white sm:text-5xl">{featuredGame.name}</h2>
                <div className="mt-4 flex items-center gap-4 text-sm text-[#d4d8ce]">
                  <span>* {featuredGame.rating?.toFixed(1)}</span>
                  <span className="text-[#7f897e]">{formatReleaseDate(featuredGame.released)}</span>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <GameBrowser
        currentPage={Math.min(currentPage, totalPages)}
        error={error}
        games={games}
        genre={genre}
        search={search}
        platform={platform}
        totalPages={totalPages}
      />

      <footer id="about" className="border-t border-[#2a302b] px-6 py-8 text-center text-xs uppercase tracking-[0.18em] text-[#657061] sm:px-10">
        Curated for curious players - GameDiscoverer
      </footer>
    </main>
  );
}
