import type {
  Game,
  GameDetails,
  GameScreenshot,
  GameStore,
  RawgListResponse,
} from "./types";
import { fetchFromRawg } from "./rawg-client";

async function fetchGames(
  query: string,
  page: number = 1,
  pageSize: number = 10,
  ordering?: string,
  genre?: string,
  platform?: string,
  tag?: string,
  developer?: string,
): Promise<RawgListResponse<Game>> {
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
  return fetchFromRawg<GameDetails>(`/games/${gameId}`);
}

async function fetchGamesByDeveloper(developerId: number, excludeGameId: number): Promise<Game[]> {
  const data = await fetchGames("", 1, 4, "-rating", undefined, undefined, undefined, String(developerId));
  return data.results.filter((game) => game.id !== excludeGameId).slice(0, 3);
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
  fetchGameScreenshots,
  fetchGameStores,
};
