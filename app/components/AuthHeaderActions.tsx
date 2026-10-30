"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

const linkClassName =
  "border border-game-border px-4 py-2 text-sm text-game-text transition hover:border-game-accent hover:text-game-accent";
const buttonClassName =
  "border border-game-border px-4 py-2 text-sm text-game-text transition hover:border-game-accent hover:text-game-accent disabled:cursor-wait disabled:opacity-60";

export default function AuthHeaderActions() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsAuthReady(true);
      },
      () => {
        setErrorMessage("Unable to check your sign-in status. Please refresh the page.");
        setIsAuthReady(true);
      },
    );
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      await signOut(auth);
    } catch {
      setErrorMessage("Unable to log out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!isAuthReady) {
    return null;
  }

  return (
    <>
      {errorMessage && (
        <span className="text-xs text-red-300" role="alert">
          {errorMessage}
        </span>
      )}
      {user ? (
        <>
          <span
            className="max-w-40 truncate text-sm text-game-text"
            title={user.displayName || user.email || undefined}
          >
            {user.displayName || user.email}
          </span>
          <Link className={linkClassName} href="/favorites">
            Favorites
          </Link>
          <button
            className={buttonClassName}
            disabled={isSigningOut}
            onClick={handleSignOut}
            type="button"
          >
            {isSigningOut ? "Logging out..." : "Log out"}
          </button>
        </>
      ) : (
        <>
          <Link className={linkClassName} href="/login">
            Log in
          </Link>
          <Link
            className="border border-game-accent bg-game-accent px-4 py-2 text-sm font-semibold text-game-ink transition hover:bg-game-accent-hover"
            href="/register"
          >
            Register
          </Link>
        </>
      )}
    </>
  );
}
