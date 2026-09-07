type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Discover", href: "#discover" },
  { label: "Wishlist", href: "#wishlist" },
  { label: "About", href: "#about" },
];

export default function Header() {
  return (
    <header className="border-b border-[#2a302b] bg-[#101211]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
        <a href="/" className="flex items-center gap-3 text-lg font-semibold text-[#f8f5ed]">
          <div className="flex h-9 w-9 items-center justify-center border border-[#d7a94b] text-xs font-bold text-[#d7a94b]">
            GD
          </div>
          <span>GameDiscoverer</span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-[#9da79a] transition hover:text-[#f8f5ed]"
            >
              {item.label}
            </a>
          ))}
        </nav>

      </div>
    </header>
  );
}
