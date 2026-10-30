"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

type FavoriteButtonProps = {
  game: {
    id: number;
    name: string;
    slug: string;
    backgroundImage: string;
  };
};

function getErrorMessage(error: unknown) {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Favorites are not available. Check the Firebase Firestore security rules.";
  }

  return "Could not update your favorites. Please try again.";
}

export default function FavoriteButton({ game }: FavoriteButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteStatusReady, setIsFavoriteStatusReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let unsubscribeFavorite: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsAuthReady(true);
        setIsFavoriteStatusReady(!currentUser);
        setErrorMessage("");
        unsubscribeFavorite?.();

        if (!currentUser) {
          setIsFavorite(false);
          return;
        }

        const favoriteRef = doc(db, "users", currentUser.uid, "favorites", String(game.id));
        unsubscribeFavorite = onSnapshot(
          favoriteRef,
          (snapshot) => {
            setIsFavorite(snapshot.exists());
            setIsFavoriteStatusReady(true);
          },
          () => {
            setErrorMessage("Unable to load your favorite status. Please try again.");
            setIsFavoriteStatusReady(true);
          },
        );
      },
      () => {
        setErrorMessage("Unable to check your sign-in status. Please refresh the page.");
        setIsAuthReady(true);
        setIsFavoriteStatusReady(true);
      },
    );

    return () => {
      unsubscribeAuth();
      unsubscribeFavorite?.();
    };
  }, [game.id]);

  async function toggleFavorite() {
    if (!user || isUpdating) return;

    setIsUpdating(true);
    setErrorMessage("");
    const favoriteRef = doc(db, "users", user.uid, "favorites", String(game.id));

    try {
      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          gameId: String(game.id),
          name: game.name,
          slug: game.slug,
          backgroundImage: game.backgroundImage,
        });
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  }

  if (!isAuthReady) return null;

  if (!user) {
    return (
      <div className="mt-6">
        <Link
          className="inline-block border border-game-accent px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-game-accent transition hover:bg-game-accent hover:text-game-ink"
          href="/login"
        >
          Log in to add to favorites
        </Link>
        {errorMessage && (
          <p className="mt-2 text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        className="border border-game-accent px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-game-accent transition hover:bg-game-accent hover:text-game-ink disabled:cursor-wait disabled:opacity-60"
        disabled={!isFavoriteStatusReady || isUpdating}
        onClick={toggleFavorite}
        type="button"
      >
        {!isFavoriteStatusReady
          ? "Checking favorite..."
          : isUpdating
            ? "Saving..."
            : isFavorite
              ? "Remove from favorites"
              : "Add to favorites"}
      </button>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
