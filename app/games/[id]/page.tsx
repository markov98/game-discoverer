import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGameDetails, fetchGameScreenshots } from "@/app/lib/games";
import { fallbackGames } from "@/app/lib/fallback-games";
import type { GameDetails, GameScreenshot } from "@/app/lib/types";

function formatReleaseDate(released?: string | null) {
  if (!released) return "Coming soon";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(released));
}

function plainText(description?: string) {
  return description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatGenre(genre: string | { name: string; slug: string }) {
  const label = typeof genre === "string" ? genre : genre.name;
  return label.replaceAll("-", " ");
}

async function getGame(id: number): Promise<{ game: GameDetails; screenshots: GameScreenshot[] }> {
  try {
    const [game, screenshots] = await Promise.all([
      fetchGameDetails(id),
      fetchGameScreenshots(id),
    ]);
    return { game, screenshots };
  } catch {
    const fallbackGame = fallbackGames.find((game) => game.id === id);
    if (!fallbackGame) notFound();
    return { game: fallbackGame, screenshots: [] };
  }
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id)) notFound();

  const { game, screenshots } = await getGame(id);
  const description = plainText(game.description) ?? "Details for this game are not available yet.";

  return (
    <main className="min-h-screen bg-[#101211] text-[#f4f1e8]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <Link className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7a94b] hover:text-[#f3c66a]" href="/">
          Back to discover
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="aspect-[4/3] overflow-hidden bg-[#252c25]">
            <img alt={game.name} className="h-full w-full object-cover" src={game.background_image ?? ""} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d7a94b]">Game details</p>
            <h1 className="mt-4 font-serif text-5xl leading-none text-[#f8f5ed] sm:text-7xl">{game.name}</h1>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#c3cabe]">
              <span>* {game.rating?.toFixed(1) ?? "-"} rating</span>
              <span>{formatReleaseDate(game.released)}</span>
              {game.metacritic && <span>{game.metacritic} Metacritic</span>}
            </div>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#b8c0b4]">{description}</p>
            {game.genres && (
              <div className="mt-8 flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span className="border border-[#39433a] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#9da79a]" key={typeof genre === "string" ? genre : genre.slug}>
                    {formatGenre(genre)}
                  </span>
                ))}
              </div>
            )}
            {game.website && (
              <a className="mt-8 inline-block border border-[#d7a94b] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#d7a94b] hover:bg-[#d7a94b] hover:text-[#151812]" href={game.website} target="_blank" rel="noreferrer">
                Official website
              </a>
            )}
          </div>
        </section>

        {screenshots.length > 0 && (
          <section className="mt-16 border-t border-[#2a302b] pt-10">
            <h2 className="font-serif text-4xl text-[#f8f5ed]">Screenshots</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {screenshots.map((screenshot) => (
                <img className="w-full bg-[#252c25]" src={screenshot.image} alt={`${game.name} screenshot`} key={screenshot.id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}