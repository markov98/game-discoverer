import type { Game, GameDetails, GameScreenshot, RawgListResponse } from './types';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_API_URL = 'https://api.rawg.io/api';

async function fetchFromRawg<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  if (!RAWG_API_KEY) {
    throw new Error('RAWG_API_KEY is not defined');
  }

  const url = new URL(`${RAWG_API_URL}${path}`);
  url.searchParams.set('key', RAWG_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
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

async function fetchGamesPage(query: string, page: number = 1, pageSize: number = 10): Promise<RawgListResponse<Game>> {
  const data = await fetchFromRawg<RawgListResponse<Game>>('/games', {
    search: query,
    page,
    page_size: pageSize,
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

export { fetchGames, fetchGamesPage, fetchGameDetails, fetchGameScreenshots };