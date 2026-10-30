"use client";

import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { auth } from "../lib/firebase";

type AuthFormProps = {
  mode: "login" | "register";
};

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead.";
    case "auth/invalid-credential":
      return "The email or password is incorrect.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/network-request-failed":
      return "Unable to connect. Check your internet connection and try again.";
    case "auth/operation-not-allowed":
      return "Email and password sign-in is not enabled for this Firebase project.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/weak-password":
      return "Choose a stronger password.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support for help.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const isRegistering = mode === "register";

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (isRegistering && !trimmedName) {
      setErrorMessage("Enter your name.");
      setIsSubmitting(false);
      return;
    }

    if (isRegistering && password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isRegistering) {
        const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);

        try {
          await updateProfile(credential.user, { displayName: trimmedName });
        } catch {
          setErrorMessage(
            "Your account was created, but your profile name could not be saved. You are signed in.",
          );
          return;
        }
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="mt-9 grid max-w-xl gap-5 border-t border-game-border-strong pt-6"
      onSubmit={handleSubmit}
    >
      {isRegistering && (
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
          Name
          <input
            autoComplete="name"
            className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent"
            maxLength={100}
            name="name"
            required
            type="text"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </label>
      )}
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
        Email
        <input
          autoComplete="email"
          className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent"
          name="email"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
      </label>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
        Password
        <input
          autoComplete={isRegistering ? "new-password" : "current-password"}
          className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent"
          minLength={isRegistering ? 6 : undefined}
          name="password"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </label>
      {isRegistering && (
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-game-text-muted">
          Confirm password
          <input
            autoComplete="new-password"
            className="h-11 w-full border border-game-border bg-game-surface px-3 text-sm font-normal normal-case tracking-normal text-game-text outline-none focus:border-game-accent"
            minLength={6}
            name="passwordConfirmation"
            required
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.currentTarget.value)}
          />
        </label>
      )}
      {errorMessage && (
        <p className="text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        className="justify-self-start border border-game-accent bg-game-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-game-ink transition hover:bg-game-accent-hover disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Please wait..." : isRegistering ? "Register" : "Log in"}
      </button>
      <p className="text-sm text-game-text-dim">
        {isRegistering ? "Already have an account?" : "New to GameDiscoverer?"}{" "}
        <Link
          className="text-game-accent underline underline-offset-4 hover:text-game-accent-hover"
          href={isRegistering ? "/login" : "/register"}
        >
          {isRegistering ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
