import type {
  Game,
  GameDetails,
  GameScreenshot,
  GameStore,
  RawgListResponse,
} from "./types";
import { fetchFromRawg } from "./rawg-client";

const developerGamesPageSize = 20;

type FetchGamesOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  genre?: string;
  platform?: string;
  tag?: string;
  developer?: string;
};

async function fetchGames({
  query = "",
  page = 1,
  pageSize = 10,
  ordering,
  genre,
  platform,
  tag,
  developer,
}: FetchGamesOptions = {}): Promise<RawgListResponse<Game>> {
  return fetchFromRawg<RawgListResponse<Game>>("/games", {
    search: query,
    page,
    page_size: pageSize,
    ordering,
    genres: genre,
    platforms: platform,
    tags: tag,
    developers: developer,
  });
}

async function fetchGameDetails(gameId: number): Promise<GameDetails> {
  return fetchFromRawg<GameDetails>(`/games/${gameId}`, {}, { next: { revalidate: 3600 } });
}

async function fetchGamesByDeveloper(developerId: number, excludeGameId: number): Promise<Game[]> {
  const data = await fetchGames({
    developer: String(developerId),
    pageSize: 4,
    ordering: "-rating",
  });
  return data.results.filter((game) => game.id !== excludeGameId).slice(0, 3);
}

async function fetchDeveloperGames(developerId: number, page: number = 1): Promise<RawgListResponse<Game>> {
  return fetchGames({
    developer: String(developerId),
    page,
    pageSize: developerGamesPageSize,
    ordering: "-rating",
  });
}

async function fetchGameScreenshots(gameId: number): Promise<GameScreenshot[]> {
  const data = await fetchFromRawg<RawgListResponse<GameScreenshot>>(`/games/${gameId}/screenshots`);
  return data.results;
}

async function fetchStoreDetails(
  storeId: number,
): Promise<{ id: number; name: string; slug: string; domain?: string | null }> {
  return fetchFromRawg<{ id: number; name: string; slug: string; domain?: string | null }>(`/stores/${storeId}`);
}

async function fetchGameStores(gameId: number): Promise<GameStore[]> {
  const data = await fetchFromRawg<RawgListResponse<GameStore>>(`/games/${gameId}/stores`);
  const rawStores = data.results ?? [];

  if (rawStores.length === 0) {
    return rawStores;
  }

  const storeIds = [...new Set(
    rawStores
      .map((store) => store.store_id ?? store.store?.id)
      .filter((id): id is number => typeof id === "number" && Number.isFinite(id)),
  )];

  if (storeIds.length === 0) {
    return rawStores;
  }

  const storeDetails = await Promise.all(
    storeIds.map(async (storeId) => {
      try {
        return await fetchStoreDetails(storeId);
      } catch {
        return null;
      }
    }),
  );

  const storeLookup = new Map(
    storeDetails
      .filter((store): store is { id: number; name: string; slug: string; domain?: string | null } => Boolean(store))
      .map((store) => [store.id, store]),
  );

  return rawStores.map((store) => {
    const storeId = store.store_id ?? store.store?.id;
    const detail = storeId ? storeLookup.get(storeId) ?? null : null;

    return {
      ...store,
      store: detail ?? store.store ?? null,
    };
  });
}

export {
  fetchGames,
  fetchGameDetails,
  fetchGamesByDeveloper,
  fetchDeveloperGames,
  fetchGameScreenshots,
  fetchGameStores,
};
