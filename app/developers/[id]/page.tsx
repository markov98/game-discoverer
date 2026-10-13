import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDeveloperDetails } from "@/app/lib/catalogs";
import { fetchDeveloperGames } from "@/app/lib/games";
import type { Game, RawgDeveloperDetails } from "@/app/lib/types";
import DeveloperGames from "./DeveloperGames";

function stripHtmlAndNormalize(description?: string) {
  return description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function getDeveloper(id: number): Promise<{
  developer?: RawgDeveloperDetails;
  games: Game[];
  totalGames: number;
  hasMore: boolean;
  error?: string;
}> {
  try {
    const [developer, games] = await Promise.all([
      fetchDeveloperDetails(id),
      fetchDeveloperGames(id),
    ]);

    return {
      developer,
      games: games.results,
      totalGames: games.count,
      hasMore: Boolean(games.next),
    };
  } catch {
    return {
      games: [],
      totalGames: 0,
      hasMore: false,
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

  const { developer, games, totalGames, hasMore, error } = await getDeveloper(id);

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
          {totalGames} {totalGames === 1 ? "game" : "games"}
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
        <DeveloperGames developerId={id} initialGames={games} initialHasMore={hasMore} />
      </section>
    </div>
  );
}
