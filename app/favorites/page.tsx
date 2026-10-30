import type { Metadata } from "next";
import FavoriteGames from "./FavoriteGames";

export const metadata: Metadata = {
  title: "My favorites | GameDiscoverer",
};

export default function FavoritesPage() {
  return (
    <section className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">Your collection</p>
        <h1 className="mt-3 font-serif text-4xl text-game-text sm:text-5xl">Favorite games</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-game-text-dim">
          The games you have saved to your favorites.
        </p>
        <FavoriteGames />
      </div>
    </section>
  );
}
