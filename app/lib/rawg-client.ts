import type { RawgListResponse } from "./types";

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_API_URL = "https://api.rawg.io/api";

export async function fetchFromRawg<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  if (!RAWG_API_KEY) {
    throw new Error("RAWG_API_KEY is not defined");
  }

  const url = new URL(`${RAWG_API_URL}${path}`);
  url.searchParams.set("key", RAWG_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Error fetching ${path}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchAllFromRawg<T>(path: string): Promise<T[]> {
  const pageSize = 40;
  const results: T[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await fetchFromRawg<RawgListResponse<T>>(path, { page, page_size: pageSize });
    results.push(...data.results);
    hasNextPage = Boolean(data.next);
    page += 1;
  }

  return results;
}
