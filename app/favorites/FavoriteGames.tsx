"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

type FavoriteGame = {
  gameId: string;
  name: string;
  slug: string;
  backgroundImage: string;
};

function getFavoriteGame(data: Record<string, unknown>, id: string): FavoriteGame {
  if (
    data.gameId !== id ||
    typeof data.name !== "string" ||
    typeof data.slug !== "string" ||
    typeof data.backgroundImage !== "string"
  ) {
    throw new Error(`Favorite ${id} has invalid data.`);
  }

  return {
    gameId: data.gameId,
    name: data.name,
    slug: data.slug,
    backgroundImage: data.backgroundImage,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Favorites are not available. Check the Firebase Firestore security rules.";
  }

  return "Could not load your favorites. Please try again.";
}

export default function FavoriteGames() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [games, setGames] = useState<FavoriteGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let unsubscribeFavorites: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsAuthReady(true);
        unsubscribeFavorites?.();
        setErrorMessage("");

        if (!currentUser) {
          setGames([]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setErrorMessage("");
        unsubscribeFavorites = onSnapshot(
          collection(db, "users", currentUser.uid, "favorites"),
          (snapshot) => {
            try {
              const favoriteGames = snapshot.docs
                .map((favorite) => getFavoriteGame(favorite.data(), favorite.id))
                .sort((left, right) => left.name.localeCompare(right.name));
              setGames(favoriteGames);
              setErrorMessage("");
            } catch {
              setErrorMessage("A favorite has invalid data and could not be displayed.");
            } finally {
              setIsLoading(false);
            }
          },
          (error) => {
            setErrorMessage(getErrorMessage(error));
            setIsLoading(false);
          },
        );
      },
      () => {
        setErrorMessage("Unable to check your sign-in status. Please refresh the page.");
        setIsAuthReady(true);
        setIsLoading(false);
      },
    );

    return () => {
      unsubscribeAuth();
      unsubscribeFavorites?.();
    };
  }, []);

  if (!isAuthReady || (user && isLoading)) {
    return (
      <p className="mt-8 text-sm text-game-text-dim" role="status">
        Loading favorites...
      </p>
    );
  }

  if (!user) {
    return (
      <div className="mt-8 border border-game-border bg-game-surface px-6 py-8">
        {errorMessage && (
          <p className="mb-4 text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        )}
        <p className="text-game-text">Log in to view your favorites.</p>
        <Link
          className="mt-5 inline-block border border-game-accent bg-game-accent px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-game-ink transition hover:bg-game-accent-hover"
          href="/login"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <p className="mt-8 text-sm text-red-300" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (games.length === 0) {
    return (
      <p className="mt-8 border border-game-border bg-game-surface px-6 py-8 text-sm text-game-text-dim">
        You haven&apos;t added any games to your favorites yet.
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <Link className="group" href={`/games/${game.gameId}`} key={game.gameId}>
          <article>
            <div className="aspect-[4/3] overflow-hidden bg-game-surface-image">
              <img
                alt={game.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                src={game.backgroundImage}
              />
            </div>
            <h2 className="border-b border-game-border-muted py-4 font-serif text-2xl text-game-text transition group-hover:text-game-accent">
              {game.name}
            </h2>
          </article>
        </Link>
      ))}
    </div>
  );
}
