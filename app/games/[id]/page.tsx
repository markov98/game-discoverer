import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGameDetails, fetchGameScreenshots, fetchGameStores, fetchGamesByDeveloper } from "@/app/lib/games";
import type { Game, GameDetails, GameScreenshot } from "@/app/lib/types";

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

async function getGame(id: number): Promise<{ game?: GameDetails; screenshots: GameScreenshot[]; developerGames: Game[]; storeLinks: Array<{ id: number; url: string; label: string }>; error?: string }> {
  try {
    const [game, screenshots, stores] = await Promise.all([
      fetchGameDetails(id),
      fetchGameScreenshots(id),
      fetchGameStores(id),
    ]);
    const developer = game.developers?.[0];
    const developerGames = developer
      ? await fetchGamesByDeveloper(developer.id, id).catch(() => [])
      : [];

    return {
      game,
      screenshots,
      developerGames,
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
      developerGames: [],
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

  const { game, screenshots, developerGames, storeLinks, error } = await getGame(id);

  if (!game) {
    return (
      <div>
        <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10 lg:px-12">
          <Link className="text-xs font-bold uppercase tracking-[0.18em] text-game-accent hover:text-game-accent-hover" href="/">
            Back to discover
          </Link>
          <div className="mt-10 border border-dashed border-game-border-dashed bg-game-surface px-6 py-16 text-center">
            <p className="font-serif text-3xl text-game-text">{error ?? "API Problem, please try again later."}</p>
          </div>
        </div>
      </div>
    );
  }

  const description = stripHtmlAndNormalize(game.description) ?? "Details for this game are not available yet.";

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <Link className="text-xs font-bold uppercase tracking-[0.18em] text-game-accent hover:text-game-accent-hover" href="/">
          Back to discover
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="aspect-[4/3] overflow-hidden bg-game-surface-image">
            <img alt={game.name} className="h-full w-full object-cover" src={game.background_image ?? ""} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">Game details</p>
            <h1 className="mt-4 font-serif text-5xl leading-none text-game-text sm:text-7xl">{game.name}</h1>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-game-text-muted">
              <span>* {game.rating?.toFixed(1) ?? "-"} rating</span>
              <span>{formatReleaseDate(game.released)}</span>
              {game.metacritic && <span>{game.metacritic} Metacritic</span>}
            </div>
            {(game.developers?.length || game.publishers?.length) ? (
              <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {game.developers && game.developers.length > 0 && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-game-text-quiet">Developer</dt>
                    <dd className="mt-1 text-game-text-dim">{game.developers.map((developer) => developer.name).join(", ")}</dd>
                  </div>
                )}
                {game.publishers && game.publishers.length > 0 && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-game-text-quiet">Publisher</dt>
                    <dd className="mt-1 text-game-text-dim">{game.publishers.map((publisher) => publisher.name).join(", ")}</dd>
                  </div>
                )}
              </dl>
            ) : null}
            <p className="mt-8 max-w-2xl text-base leading-8 text-game-text-subtle">{description}</p>
            {game.genres && game.genres.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <Link
                    className="border border-game-border-soft px-3 py-2 text-xs uppercase tracking-[0.12em] text-game-text-dim transition hover:border-game-accent hover:text-game-text"
                    href={`/?genre=${encodeURIComponent(genre.slug)}&page=1`}
                    key={genre.slug}
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}
            {game.tags && game.tags.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {game.tags.slice(0, 3).map((tag) => (
                    <Link
                      className="border border-game-border-soft px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-game-text-dim transition hover:border-game-accent hover:text-game-text"
                      href={`/?tag=${encodeURIComponent(tag.slug)}&page=1`}
                      key={tag.slug}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>

                {game.tags.length > 3 && (
                  <details className="group mt-3">
                    <summary className="flex w-fit cursor-pointer list-none items-center gap-2 whitespace-nowrap px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-game-accent">
                      <span>+{game.tags.length - 3} more</span>
                      <span className="text-game-text-dim transition group-open:rotate-180">▾</span>
                    </summary>
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-game-border-soft pt-3">
                      {game.tags.slice(3).map((tag) => (
                        <Link
                          className="border border-game-border-soft px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-game-text-dim transition hover:border-game-accent hover:text-game-text"
                          href={`/?tag=${encodeURIComponent(tag.slug)}&page=1`}
                          key={tag.slug}
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
            {(game.website || storeLinks.length > 0) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {game.website && (
                  <a className="inline-block border border-game-accent px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-game-accent hover:bg-game-accent hover:text-game-ink" href={game.website} target="_blank" rel="noreferrer">
                    Official website
                  </a>
                )}
                {storeLinks.map((store) => (
                  <a
                    className="inline-block border border-game-border-soft px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-game-text-muted transition hover:border-game-accent hover:text-game-text"
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
          <section className="mt-16 border-t border-game-border-faint pt-10">
            <h2 className="font-serif text-4xl text-game-text">Screenshots</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {screenshots.map((screenshot) => (
                <img className="w-full bg-game-surface-image" src={screenshot.image} alt={`${game.name} screenshot`} key={screenshot.id} />
              ))}
            </div>
          </section>
        )}

        {developerGames.length > 0 && (
          <section className="mt-16 border-t border-game-border-faint pt-10">
            <h2 className="font-serif text-4xl text-game-text">More from {game.developers?.[0]?.name}</h2>
            <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {developerGames.slice(0, 3).map((developerGame) => (
                <Link className="group" href={`/games/${developerGame.id}`} key={developerGame.id}>
                  <article>
                    <div className="aspect-[4/3] overflow-hidden bg-game-surface-image">
                      <img
                        alt={developerGame.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={developerGame.background_image ?? ""}
                      />
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-game-border-muted py-4">
                      <div>
                        <h3 className="font-serif text-2xl text-game-text">{developerGame.name}</h3>
                        <p className="mt-1 text-sm text-game-text-faint">{formatReleaseDate(developerGame.released)}</p>
                      </div>
                      <span className="pt-1 text-sm text-game-accent">* {developerGame.rating?.toFixed(1) ?? "-"}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}