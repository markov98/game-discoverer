import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGameDetails, fetchGameScreenshots, fetchGameStores } from "@/app/lib/games";
import type { GameDetails, GameScreenshot } from "@/app/lib/types";

function formatReleaseDate(released?: string | null) {
  if (!released) return "Coming soon";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(released));
}

function stripHtmlAndNormalize(description?: string) {
  return description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function getGame(id: number): Promise<{ game?: GameDetails; screenshots: GameScreenshot[]; storeLinks: Array<{ id: number; url: string; label: string }>; error?: string }> {
  try {
    const [game, screenshots, stores] = await Promise.all([
      fetchGameDetails(id),
      fetchGameScreenshots(id),
      fetchGameStores(id),
    ]);

    return {
      game,
      screenshots,
      storeLinks: (stores ?? [])
        .filter((store) => Boolean(store?.url))
        .map((store) => ({
          id: store.id,
          url: store.url ?? "",
          label: store.store?.name ?? store.store?.slug ?? "Store",
        })),
    };
  } catch {
    return {
      game: undefined,
      screenshots: [],
      storeLinks: [],
      error: "API Problem, please try again later.",
    };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = Number.parseInt((await params).id, 10);

  if (!Number.isInteger(id)) {
    return { title: "Game details | GameDiscoverer" };
  }

  try {
    const game = await fetchGameDetails(id);
    return { title: `${game.name} | GameDiscoverer` };
  } catch {
    return { title: "Game details | GameDiscoverer" };
  }
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id)) notFound();

  const { game, screenshots, storeLinks, error } = await getGame(id);

  if (!game) {
    return (
      <div>
        <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10 lg:px-12">
          <Link className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7a94b] hover:text-[#f3c66a]" href="/">
            Back to discover
          </Link>
          <div className="mt-10 border border-dashed border-[#465146] bg-[#171b18] px-6 py-16 text-center">
            <p className="font-serif text-3xl text-[#f8f5ed]">{error ?? "API Problem, please try again later."}</p>
          </div>
        </div>
      </div>
    );
  }

  const description = stripHtmlAndNormalize(game.description) ?? "Details for this game are not available yet.";

  return (
    <div>
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
            {game.genres && game.genres.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span className="border border-[#39433a] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#9da79a]" key={genre.slug}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            {game.tags && game.tags.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {game.tags.slice(0, 3).map((tag) => (
                    <span className="border border-[#39433a] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#9da79a]" key={tag.slug}>
                      {tag.name}
                    </span>
                  ))}
                </div>

                {game.tags.length > 3 && (
                  <details className="group mt-3">
                    <summary className="flex w-fit cursor-pointer list-none items-center gap-2 whitespace-nowrap px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#d7a94b]">
                      <span>+{game.tags.length - 3} more</span>
                      <span className="text-[#9da79a] transition group-open:rotate-180">▾</span>
                    </summary>
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#39433a] pt-3">
                      {game.tags.slice(3).map((tag) => (
                        <span className="border border-[#39433a] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#9da79a]" key={tag.slug}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
            {(game.website || storeLinks.length > 0) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {game.website && (
                  <a className="inline-block border border-[#d7a94b] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#d7a94b] hover:bg-[#d7a94b] hover:text-[#151812]" href={game.website} target="_blank" rel="noreferrer">
                    Official website
                  </a>
                )}
                {storeLinks.map((store) => (
                  <a
                    className="inline-block border border-[#39433a] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#c3cabe] transition hover:border-[#d7a94b] hover:text-[#f8f5ed]"
                    href={store.url}
                    key={store.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {store.label}
                  </a>
                ))}
              </div>
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
    </div>
  );
}