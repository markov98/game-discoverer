type NavItem = {
  label: string;
  href: string;
};

export default function Header() {
  return (
    <header className="border-b border-game-border-faint bg-game-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
        <a href="/" className="flex items-center gap-3 text-lg font-semibold text-game-text">
          <div className="flex h-9 w-9 items-center justify-center border border-game-accent text-xs font-bold text-game-accent">
            GD
          </div>
          <span>GameDiscoverer</span>
        </a>

      </div>
    </header>
  );
}
