import type { Metadata } from "next";
import Link from "next/link";
import { fetchDevelopers } from "@/app/lib/catalogs";

const pageSize = 24;

export const metadata: Metadata = {
  title: "Explore developers | GameDiscoverer",
};

type SearchParams = {
  search?: string | string[];
  page?: string | string[];
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageHref(search: string, page: number): string {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("page", String(page));
  return `/developers?${params.toString()}`;
}

async function getDevelopers(search: string, page: number) {
  try {
    const fetchPage = (pageNumber: number) => fetchDevelopers({
      page: pageNumber,
      pageSize,
      search,
    });
    const data = await fetchPage(page);
    const lastPage = Math.max(1, Math.ceil(data.count / pageSize));
    const correctedPage = Math.min(page, lastPage);
    const results = correctedPage === page ? data : await fetchPage(correctedPage);
    return { developers: results.results, total: data.count, page: correctedPage, error: null };
  } catch {
    return {
      developers: [],
      total: 0,
      page,
      error: "Could not load developers. Please try again later.",
    };
  }
}

export default async function DevelopersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = firstValue(params.search).trim();
  const requestedPage = Number.parseInt(firstValue(params.page) || "1", 10);
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { developers, total, page, error } = await getDevelopers(search, currentPage);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <section className="border-b border-game-border-faint bg-[radial-gradient(circle_at_75%_15%,var(--game-hero-glow)_0%,transparent_30%),linear-gradient(135deg,var(--game-hero-start)_0%,var(--game-background)_60%)]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">Meet the makers</p>
          <h1 className="mt-3 font-serif text-4xl text-game-text sm:text-5xl">Explore developers</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-game-text-dim">
            Find the studios behind the games you love and explore their libraries.
          </p>
          <form
            action="/developers"
            className="mt-9 flex max-w-xl items-center gap-2 border-b border-game-text-quiet pb-3 focus-within:border-game-accent"
            method="get"
          >
            <input
              aria-label="Search developers"
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-game-text outline-none placeholder:text-game-text-faint"
              defaultValue={search}
              name="search"
              placeholder="Search studios"
              type="search"
            />
            <button
              className="text-xs font-bold uppercase tracking-[0.18em] text-game-accent transition hover:text-game-accent-hover"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-game-border-faint pb-4">
          <h2 className="font-serif text-3xl text-game-text">
            {search ? `Results for “${search}”` : "Popular developers"}
          </h2>
          {!error && <p className="text-sm text-game-text-muted">{total.toLocaleString()} developers</p>}
        </div>

        {error ? (
          <p className="mt-8 border border-game-border-dashed bg-game-surface px-6 py-10 text-center text-sm text-game-text-muted" role="alert">
            {error}
          </p>
        ) : developers.length > 0 ? (
          <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {developers.map((developer) => (
              <Link className="group" href={`/developers/${developer.id}`} key={developer.id}>
                <article className="flex h-full min-h-48 flex-col justify-between border border-game-border-faint bg-game-surface transition group-hover:border-game-accent">
                  <div
                    aria-hidden="true"
                    className="h-36 bg-game-surface-image bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
                    style={{
                      backgroundImage: developer.image_background
                        ? `linear-gradient(to top, var(--game-surface), transparent), url(${JSON.stringify(developer.image_background)})`
                        : undefined,
                    }}
                  />
                  <div className="flex items-end justify-between gap-4 px-5 pb-5">
                    <h3 className="font-serif text-2xl text-game-text">{developer.name}</h3>
                    <p className="shrink-0 text-xs text-game-text-muted">
                      {developer.games_count ?? 0} {developer.games_count === 1 ? "game" : "games"}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-game-text-muted">
            {search ? "No developers found. Try another search." : "No developers found."}
          </p>
        )}

        {!error && totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                className="border border-game-border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted transition hover:border-game-accent hover:text-white"
                href={pageHref(search, page - 1)}
              >
                Previous
              </Link>
            )}
            <span className="px-4 text-sm text-game-text-faint">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                className="border border-game-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-game-accent transition hover:bg-game-accent hover:text-game-ink"
                href={pageHref(search, page + 1)}
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
