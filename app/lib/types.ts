export type Game = {
  id: number;
  slug: string;
  name: string;
  released?: string | null;
  background_image?: string | null;
  rating?: number;
  ratings_count?: number;
  reviews_count?: number;
  genres?: Array<{ name: string; slug: string }>;
  tags?: Array<{ name: string; slug: string }>;
  metacritic?: number | null;
};

export type GameStore = {
  id: number;
  game_id?: number;
  store_id?: number | null;
  url?: string | null;
  store?: {
    id: number;
    name: string;
    slug: string;
    domain?: string | null;
  } | null;
};

export type GameDetails = Game & {
  description?: string;
  website?: string | null;
  reddit_url?: string | null;
};

export type GameScreenshot = {
  id: number;
  image: string;
  width: number;
  height: number;
};

export type RawgListResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type RawgCatalogItem = {
  id: number;
  name: string;
  slug: string;
  games_count?: number;
  image_background?: string | null;
};

export type RawgTag = RawgCatalogItem;
export type RawgGenre = RawgCatalogItem;
export type RawgPlatform = RawgCatalogItem;
