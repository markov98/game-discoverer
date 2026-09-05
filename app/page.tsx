import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
            Discover your next obsession
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Find the games that match your taste.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Browse curated recommendations, trending picks, and hidden gems from your favorite genres.
          </p>
        </div>
      </section>
    </main>
  );
}
