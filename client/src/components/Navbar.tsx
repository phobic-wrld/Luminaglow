import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import SearchBar from "./SearchBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl, isOAuthEnabled } from "@/const";

const navLinks = [
  { label: "All", href: "/" },
  { label: "Women", href: "/collections/women" },
  { label: "Men", href: "/collections/men" },
  { label: "Unisex", href: "/collections/unisex" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const loginUrl = getLoginUrl();
  const { data: authProviders } = trpc.auth.providers.useQuery();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminButton, setShowAdminButton] = useState(false);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks === 5) {
      window.location.href = "/admin";
      setLogoClicks(0);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[#0f0a07]/82 shadow-[0_18px_50px_rgba(0,0,0,0.30)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex flex-col items-start leading-none flex-shrink-0 bg-transparent border-none cursor-pointer p-0">
            <span
              className="text-2xl md:text-3xl font-serif font-light tracking-widest"
              style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}
            >
              LUMINA
            </span>
            <span
              className="text-xs tracking-[0.35em] uppercase font-sans font-light"
              style={{ color: scrolled ? "rgba(245,238,225,0.62)" : "rgba(245,238,225,0.74)", marginTop: "-2px" }}
            >
              GLOW
            </span>
          </button>

          {/* Desktop Nav + Search */}
          <nav className="hidden md:flex items-center gap-8 flex-1 max-w-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-[0.2em] uppercase font-sans font-medium transition-colors duration-200`}
                style={location === link.href ? { color: 'var(--gold)' } : { color: 'rgba(245,240,232,0.72)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Mobile menu */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Desktop Search */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* Admin Login/Logout Button - Hidden by default, revealed by Easter egg */}
            {showAdminButton && isAuthenticated && user?.role === 'admin' ? (
              <div className="hidden sm:flex items-center gap-2 animate-in fade-in duration-300">
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all"
                  style={{
                    backgroundColor: 'var(--gold)',
                    color: '#0f0a07',
                  }}
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-1 hover:opacity-80 transition-opacity"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" style={{ color: 'rgba(245,240,232,0.85)' }} />
                </button>
              </div>
            ) : showAdminButton ? (
              isOAuthEnabled && loginUrl ? (
                <a
                  href={loginUrl}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all animate-in fade-in duration-300"
                  style={{
                    backgroundColor: 'var(--gold)',
                    color: '#0f0a07',
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </a>
              ) : authProviders?.localAdminEnabled ? (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all animate-in fade-in duration-300"
                  style={{
                    backgroundColor: 'var(--gold)',
                    color: '#0f0a07',
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Link>
              ) : (
                <span
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider animate-in fade-in duration-300"
                  style={{
                    backgroundColor: 'var(--border)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Admin Login Unavailable
                </span>
              )
            ) : null}

            {/* Mobile search toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              {showSearch ? (
                <X className="w-5 h-5" style={{ color: "rgba(245,240,232,0.88)" }} />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(245,240,232,0.85)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="w-5 h-5" style={{ color: "rgba(245,240,232,0.88)" }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: 'rgba(245,240,232,0.85)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {showSearch && (
          <div className="md:hidden border-t border-[var(--border)] bg-[#0f0a07]/94 p-4 backdrop-blur-xl">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[#0f0a07]/96 py-4 backdrop-blur-xl">
          <nav className="container flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-sm tracking-[0.2em] uppercase font-sans font-medium border-b border-[var(--border)] last:border-0 transition-colors`}
                style={location === link.href ? { color: 'var(--gold)' } : {}}
              >
                {link.label}
              </Link>
            ))}
            {showAdminButton && isAuthenticated && user?.role === 'admin' ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm tracking-[0.2em] uppercase font-sans font-medium border-b border-[var(--border)]"
                  style={{ color: 'var(--gold)' }}
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="py-3 text-sm tracking-[0.2em] uppercase font-sans font-medium border-b border-[var(--border)] text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : showAdminButton ? (
              isOAuthEnabled && loginUrl ? (
                <a
                  href={loginUrl}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm tracking-[0.2em] uppercase font-sans font-medium border-b border-[var(--border)] block"
                  style={{ color: 'var(--gold)' }}
                >
                  Admin Login
                </a>
              ) : authProviders?.localAdminEnabled ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm tracking-[0.2em] uppercase font-sans font-medium border-b border-[var(--border)] block"
                  style={{ color: 'var(--gold)' }}
                >
                  Admin Login
                </Link>
              ) : (
                <span
                  className="py-3 text-sm tracking-[0.2em] uppercase font-sans font-medium border-b border-[var(--border)] block text-muted-foreground"
                >
                  Admin Login Unavailable
                </span>
              )
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
