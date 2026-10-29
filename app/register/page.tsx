import type { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = {
  title: "Register | GameDiscoverer",
};

export default function RegisterPage() {
  return (
    <section className="border-b border-game-border-faint bg-[radial-gradient(circle_at_75%_15%,var(--game-hero-glow)_0%,transparent_30%),linear-gradient(135deg,var(--game-hero-start)_0%,var(--game-background)_60%)]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-game-accent">Join the community</p>
        <h1 className="mt-3 font-serif text-4xl text-game-text sm:text-5xl">Create an account</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-game-text-dim">
          Register for a GameDiscoverer account.
        </p>

        <AuthForm mode="register" />
      </div>
    </section>
  );
}
