type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Discover", href: "#discover" },
  { label: "Trending", href: "#trending" },
  { label: "Wishlist", href: "#wishlist" },
  { label: "About", href: "#about" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3 text-lg font-semibold text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-600/30">
            GD
          </div>
          <span>GameDiscoverer</span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white sm:inline-flex"
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
