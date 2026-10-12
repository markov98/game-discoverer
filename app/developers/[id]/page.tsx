import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDeveloperDetails } from "@/app/lib/catalogs";
import { formatReleaseDate } from "@/app/lib/formatters";
import { fetchAllGamesByDeveloper } from "@/app/lib/games";
import type { Game, RawgDeveloperDetails } from "@/app/lib/types";

function stripHtmlAndNormalize(description?: string) {
  return description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function getDeveloper(id: number): Promise<{
  developer?: RawgDeveloperDetails;
  games: Game[];
  error?: string;
}> {
  try {
    const [developer, games] = await Promise.all([
      fetchDeveloperDetails(id),
      fetchAllGamesByDeveloper(id),
    ]);

    return { developer, games };
  } catch {
    return {
      games: [],
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

  if (!Number.isInteger(id) || id <= 0) {
    return { title: "Developer details | GameDiscoverer" };
  }

  try {
    const developer = await fetchDeveloperDetails(id);
    return { title: `${developer.name} | GameDiscoverer` };
  } catch {
    return { title: "Developer details | GameDiscoverer" };
  }
}

export default async function DeveloperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const { developer, games, error } = await getDeveloper(id);

  if (!developer) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10 lg:px-12">
        <Link className="text-xs font-bold uppercase tracking-[0.18em] text-game-accent hover:text-game-accent-hover" href="/">
          Back to discover
        </Link>
        <div className="mt-10 border border-dashed border-game-border-dashed bg-game-surface px-6 py-16 text-center">
          <p className="font-serif text-3xl text-game-text">{error ?? "API Problem, please try again later."}</p>
        </div>
      </div>
    );
  }

  const description = stripHtmlAndNormalize(developer.description);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">

      <section className="mt-10 border-b border-game-border-faint pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">Developer</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-game-text sm:text-7xl">{developer.name}</h1>
        <p className="mt-5 text-sm text-game-text-muted">
          {games.length} {games.length === 1 ? "game" : "games"}
        </p>
        {description && <p className="mt-6 max-w-3xl text-base leading-8 text-game-text-subtle">{description}</p>}
        {developer.website && (
          <a
            className="mt-6 inline-block text-sm text-game-accent transition hover:text-game-accent-hover"
            href={developer.website}
            rel="noreferrer"
            target="_blank"
          >
            Visit website
          </a>
        )}
      </section>

      <section className="pt-10">
        <h2 className="font-serif text-4xl text-game-text">Games by {developer.name}</h2>
        {games.length > 0 ? (
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link className="group" href={`/games/${game.id}`} key={game.id}>
                <article>
                  <div className="aspect-[4/3] overflow-hidden bg-game-surface-image">
                    <img
                      alt={game.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={game.background_image ?? ""}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-game-border-muted py-4">
                    <div>
                      <h3 className="font-serif text-2xl text-game-text">{game.name}</h3>
                      <p className="mt-1 text-sm text-game-text-faint">{formatReleaseDate(game.released)}</p>
                    </div>
                    <span className="pt-1 text-sm text-game-accent">* {game.rating?.toFixed(1) ?? "-"}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-game-text-muted">No games found for this developer.</p>
        )}
      </section>
    </div>
  );
}
