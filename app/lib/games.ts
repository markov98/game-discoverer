import type { Game, GameDetails, GameScreenshot, GameStore, RawgListResponse } from './types';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_API_URL = 'https://api.rawg.io/api';

async function fetchFromRawg<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  if (!RAWG_API_KEY) {
    throw new Error('RAWG_API_KEY is not defined');
  }

  const url = new URL(`${RAWG_API_URL}${path}`);
  url.searchParams.set('key', RAWG_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Error fetching ${path}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function fetchGames(query: string, page: number = 1, pageSize: number = 10): Promise<Game[]> {
  const data = await fetchGamesPage(query, page, pageSize);

  return data.results;
}

async function fetchGamesPage(
  query: string,
  page: number = 1,
  pageSize: number = 10,
  ordering?: string,
  genre?: string,
  platform?: string,
): Promise<RawgListResponse<Game>> {
  const data = await fetchFromRawg<RawgListResponse<Game>>('/games', {
    search: query,
    page,
    page_size: pageSize,
    ordering,
    genres: genre,
    platforms: platform,
  });

  return data;
}

async function fetchGameDetails(gameId: number): Promise<GameDetails> {
  return fetchFromRawg<GameDetails>(`/games/${gameId}`);
}

async function fetchGameScreenshots(gameId: number): Promise<GameScreenshot[]> {
  const data = await fetchFromRawg<RawgListResponse<GameScreenshot>>(`/games/${gameId}/screenshots`);
  return data.results;
}

async function fetchStoreDetails(storeId: number): Promise<{ id: number; name: string; slug: string; domain?: string | null }> {
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
    storeDetails.filter((store): store is { id: number; name: string; slug: string; domain?: string | null } => Boolean(store)).map((store) => [store.id, store]),
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

export { fetchGames, fetchGamesPage, fetchGameDetails, fetchGameScreenshots, fetchGameStores };