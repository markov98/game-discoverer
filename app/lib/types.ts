export type Game = {
  id: number;
  slug: string;
  name: string;
  released?: string | null;
  background_image?: string | null;
  rating?: number;
  ratings_count?: number;
  reviews_count?: number;
  genres?: (string | { name: string; slug: string })[];
  metacritic?: number | null;
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
