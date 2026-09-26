import type { Metadata } from "next";
import Link from "next/link";
import { fetchSearchFilterOptions } from "../lib/games";

export const metadata: Metadata = {
  title: "Advanced game search | GameDiscoverer",
};

type SearchParams = {
  search?: string | string[];
  genre?: string | string[];
  platform?: string | string[];
  tag?: string | string[];
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeValues(value: string | string[] | undefined): string[] {
  const values = Array.isArray(value) ? value : value ? value.split(",") : [];
  return [...new Set(values.flatMap((item) => item.split(",")).filter(Boolean))];
}

export default async function AdvancedSearch({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = firstValue(params.search);
  const genres = normalizeValues(params.genre);
  const platform = firstValue(params.platform);
  const tags = normalizeValues(params.tag);
  const filterOptions = await fetchSearchFilterOptions().catch(() => ({ genres: [], platforms: [], tags: [] }));

  return (
    <>
      <section className="border-b border-game-border-faint bg-[radial-gradient(circle_at_75%_15%,var(--game-hero-glow)_0%,transparent_30%),linear-gradient(135deg,var(--game-hero-start)_0%,var(--game-background)_60%)]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">The library</p>
          <h1 className="mt-3 font-serif text-4xl text-game-text sm:text-5xl">Advanced search</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-game-text-dim">Find games by title, platform, genre, and tags.</p>

          <form action="/" className="mt-8 grid gap-5 border-t border-game-border-strong pt-6 sm:grid-cols-2 lg:grid-cols-4" method="get">
            <label className="grid content-start gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
              Game title
              <input className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent" name="search" placeholder="Any title" type="search" defaultValue={search} />
            </label>
            <fieldset className="min-w-0">
              <legend className="text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">Genres</legend>
              <div className="mt-2 grid h-44 grid-cols-2 content-start gap-x-3 gap-y-1 overflow-y-auto border border-game-border bg-game-surface p-3">
                {filterOptions.genres.map((item) => (
                  <label className="flex min-w-0 items-start gap-2 py-1 text-xs font-normal leading-4 text-game-text-dim" key={item.id}>
                    <input className="mt-0.5 shrink-0 accent-game-accent" defaultChecked={genres.includes(item.slug)} name="genre" type="checkbox" value={item.slug} />
                    <span className="break-words">{item.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="grid content-start gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
              Platform
              <select className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent" defaultValue={platform} name="platform">
                <option value="">Any platform</option>
                {filterOptions.platforms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <fieldset className="min-w-0">
              <legend className="text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">Tags</legend>
              <div className="mt-2 grid h-44 grid-cols-2 content-start gap-x-3 gap-y-1 overflow-y-auto border border-game-border bg-game-surface p-3">
                {filterOptions.tags.map((item) => (
                  <label className="flex min-w-0 items-start gap-2 py-1 text-xs font-normal leading-4 text-game-text-dim" key={item.id}>
                    <input className="mt-0.5 shrink-0 accent-game-accent" defaultChecked={tags.includes(item.slug)} name="tag" type="checkbox" value={item.slug} />
                    <span className="break-words">{item.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-4">
              <button className="border border-game-accent bg-game-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-game-ink transition hover:bg-game-accent-hover" type="submit">Apply filters</button>
              <Link className="text-sm text-game-text-dim transition hover:text-game-text" href="/search">Clear filters</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}