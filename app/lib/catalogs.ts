import type {
  RawgDeveloper,
  RawgDeveloperDetails,
  RawgGenre,
  RawgListResponse,
  RawgPlatform,
  RawgPublisher,
  RawgPublisherDetails,
  RawgTag,
} from "./types";
import { fetchAllFromRawg, fetchFromRawg } from "./rawg-client";

async function fetchTags(): Promise<RawgTag[]> {
  return fetchAllFromRawg<RawgTag>("/tags");
}

async function fetchGenres(): Promise<RawgGenre[]> {
  return fetchAllFromRawg<RawgGenre>("/genres");
}

async function fetchPlatforms(): Promise<RawgPlatform[]> {
  return fetchAllFromRawg<RawgPlatform>("/platforms");
}

async function fetchDevelopers(): Promise<RawgDeveloper[]> {
  return fetchAllFromRawg<RawgDeveloper>("/developers");
}

async function fetchDeveloperDetails(developerId: number): Promise<RawgDeveloperDetails> {
  return fetchFromRawg<RawgDeveloperDetails>(`/developers/${developerId}`);
}

async function fetchPublishers(): Promise<RawgPublisher[]> {
  return fetchAllFromRawg<RawgPublisher>("/publishers");
}

async function fetchPublisherDetails(publisherId: number): Promise<RawgPublisherDetails> {
  return fetchFromRawg<RawgPublisherDetails>(`/publishers/${publisherId}`);
}

async function fetchSearchFilterOptions(): Promise<{
  genres: RawgGenre[];
  platforms: RawgPlatform[];
  tags: RawgTag[];
}> {
  const [genres, platforms, tags] = await Promise.all([
    fetchFromRawg<RawgListResponse<RawgGenre>>("/genres", { page: 1, page_size: 40 }),
    fetchFromRawg<RawgListResponse<RawgPlatform>>("/platforms", { page: 1, page_size: 40 }),
    fetchFromRawg<RawgListResponse<RawgTag>>("/tags", { page: 1, page_size: 40 }),
  ]);

  return { genres: genres.results, platforms: platforms.results, tags: tags.results };
}

export {
  fetchTags,
  fetchGenres,
  fetchPlatforms,
  fetchDevelopers,
  fetchDeveloperDetails,
  fetchPublishers,
  fetchPublisherDetails,
  fetchSearchFilterOptions,
};
