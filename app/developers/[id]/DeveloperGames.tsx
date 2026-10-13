"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatReleaseDate } from "@/app/lib/formatters";
import type { Game } from "@/app/lib/types";

const loadErrorMessage = "Could not load more games. Please try again.";

export default function DeveloperGames({
  developerId,
  initialGames,
  initialHasMore,
}: {
  developerId: number;
  initialGames: Game[];
  initialHasMore: boolean;
}) {
  const [games, setGames] = useState(initialGames);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(2);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(async (retry = false) => {
    if (!hasMore || isLoadingRef.current || (error && !retry)) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/developers/${developerId}/games?page=${page}`);
      if (!response.ok) throw new Error(loadErrorMessage);

      const data: { games: Game[]; hasMore: boolean } = await response.json();
      setGames((currentGames) => [...currentGames, ...data.games]);
      setHasMore(data.hasMore);
      setPage((currentPage) => currentPage + 1);
    } catch {
      setError(loadErrorMessage);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [developerId, error, hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || error || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [error, hasMore, loadMore]);

  return (
    <>
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

      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div aria-hidden="true" className="h-px w-full" ref={sentinelRef} />
          {error && <p className="text-sm text-game-text-muted" role="alert">{error}</p>}
          <button
            className="border border-game-border px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-game-accent transition hover:border-game-accent disabled:cursor-wait disabled:opacity-60"
            disabled={isLoading}
            onClick={() => void loadMore(true)}
            type="button"
          >
            {isLoading ? "Loading games..." : error ? "Try again" : "Load more games"}
          </button>
        </div>
      )}
      {isLoading && <p className="sr-only" role="status">Loading more games</p>}
    </>
  );
}
