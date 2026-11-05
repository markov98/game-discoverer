import type { RawgListResponse } from "./types";

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_API_URL = "https://api.rawg.io/api";
const RAWG_CACHE_REVALIDATE_SECONDS = 86_400;
const RAWG_REQUEST_TIMEOUT_MS = 8_000;

export class RawgApiError extends Error {
  constructor(
    message: string,
    readonly kind: "unavailable" | "request" | "not-found",
    readonly status?: number,
  ) {
    super(message);
    this.name = "RawgApiError";
  }
}

export function isRawgUnavailable(error: unknown): boolean {
  return error instanceof RawgApiError && error.kind === "unavailable";
}

export function isRawgNotFound(error: unknown): boolean {
  return error instanceof RawgApiError && error.kind === "not-found";
}

export async function fetchFromRawg<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  options: { next?: { revalidate?: number } } = {},
): Promise<T> {
  if (!RAWG_API_KEY) {
    throw new RawgApiError("RAWG_API_KEY is not defined", "request");
  }

  const url = new URL(`${RAWG_API_URL}${path}`);
  url.searchParams.set("key", RAWG_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      ...options,
      next: {
        revalidate: options.next?.revalidate ?? RAWG_CACHE_REVALIDATE_SECONDS,
      },
      signal: AbortSignal.timeout(RAWG_REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new RawgApiError("RAWG could not be reached", "unavailable");
  }

  if (!response.ok) {
    const kind = response.status === 404
      ? "not-found"
      : response.status === 408 || response.status === 429 || response.status >= 500
        ? "unavailable"
        : "request";
    throw new RawgApiError(`Error fetching ${path}: ${response.statusText}`, kind, response.status);
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
