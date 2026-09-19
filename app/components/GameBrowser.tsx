"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import type { Game } from "../lib/types";
import { formatReleaseDate } from "../lib/formatters";

export function Search({ genre, platform, query, tag }: { genre: string; platform: string; query: string; tag: string }) {
  return (
    <form
      className="mt-9 flex max-w-xl items-center gap-2 border-b border-game-text-quiet pb-3 focus-within:border-game-accent"
      action="/"
      method="get"
    >
      <input
        aria-label="Search games"
        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-game-text outline-none placeholder:text-game-text-faint"
        placeholder="Search for a game"
        type="search"
        name="search"
        defaultValue={query}
      />
      {genre && <input type="hidden" name="genre" value={genre} />}
      {platform && <input type="hidden" name="platform" value={platform} />}
      {tag && <input type="hidden" name="tag" value={tag} />}
      <button className="text-xs font-bold uppercase tracking-[0.18em] text-game-accent transition hover:text-game-accent-hover" type="submit">
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
  tag,
  totalPages,
}: {
  currentPage: number;
  error?: string | null;
  genre: string;
  games: Game[];
  platform: string;
  search: string;
  tag: string;
  totalPages: number;
}) {
  const gridGames = games;
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre) params.set("genre", genre);
    if (platform) params.set("platform", platform);
    if (tag) params.set("tag", tag);
    params.set("page", String(page));
    return `/?${params.toString()}`;
  };
  const currentHref = pageHref(currentPage);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isLoading = pendingHref !== null && pendingHref !== currentHref;

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    setPendingHref(event.currentTarget.getAttribute("href"));
  };

  return (
    <section id="discover" aria-busy={isLoading} className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">The library</p>
          <h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-game-text">Explore</h2>
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
          if (tag) params.set("tag", tag);
          if (item.value) params.set("genre", item.value);
          if (item.value || search) params.set("page", "1");

          return (
            <Link
              className={`whitespace-nowrap border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${genre === item.value ? "border-game-accent bg-game-accent text-game-ink" : "border-game-border text-game-text-dim hover:border-game-accent hover:text-game-text"}`}
              href={params.toString() ? `/?${params.toString()}` : "/"}
              key={item.value || "all"}
              onClick={handleNavigation}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" aria-label="Game platforms">
        <span className="mr-2 self-center text-xs font-bold uppercase tracking-[0.12em] text-game-text-quiet">Platform</span>
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
          if (tag) params.set("tag", tag);
          if (item.value) params.set("platform", item.value);
          if (item.value || genre || search) params.set("page", "1");

          return (
            <Link
              className={`whitespace-nowrap border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition ${platform === item.value ? "border-game-accent bg-game-accent text-game-ink" : "border-game-border text-game-text-dim hover:border-game-accent hover:text-game-text"}`}
              href={params.toString() ? `/?${params.toString()}` : "/"}
              key={item.value || "all"}
              onClick={handleNavigation}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading games">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[4/3] animate-pulse bg-game-surface-image" />
              <div className="border-b border-game-border-muted py-4">
                <div className="h-6 w-3/4 animate-pulse rounded-sm bg-game-surface-muted" />
                <div className="mt-2 h-4 w-1/3 animate-pulse rounded-sm bg-game-surface" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-10 border border-dashed border-game-border-dashed bg-game-surface px-6 py-16 text-center">
          <p className="font-serif text-2xl text-game-text">{error}</p>
        </div>
      ) : gridGames.length > 0 ? (
        <div id="trending" className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {gridGames.map((game, index) => (
            <Link className="group" href={`/games/${game.id}`} key={game.id}>
              <article>
                <div className="relative aspect-[4/3] overflow-hidden bg-game-surface-image">
                  <img alt={game.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={game.background_image ?? ""} />
                  <span className="absolute left-4 top-4 bg-game-background/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-game-accent">0{index + 1}</span>
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
        <div className="mt-10 border border-dashed border-game-border-dashed px-6 py-16 text-center">
          <p className="font-serif text-2xl text-game-text">No games match that search.</p>
          <p className="mt-2 text-sm text-game-text-faint">Try a different title or clear the search field.</p>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              className="border border-game-border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted transition hover:border-game-accent hover:text-white"
              href={pageHref(currentPage - 1)}
              onClick={handleNavigation}
            >
              Previous
            </Link>
          )}
          <span className="px-4 text-sm text-game-text-faint">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              className="border border-game-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-game-accent transition hover:bg-game-accent hover:text-game-ink"
              href={pageHref(currentPage + 1)}
              onClick={handleNavigation}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}

export default GameBrowser;