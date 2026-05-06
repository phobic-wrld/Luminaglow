import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Search, X } from "lucide-react";
import type { Perfume } from "../../../drizzle/schema";

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { data: searchResults = [], isLoading } = trpc.perfumes.search.useQuery(
    { query: searchQuery || "" },
    { enabled: !!searchQuery && searchQuery.trim().length > 0 }
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      setSearchQuery(query);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSearchQuery(null);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPerfume = (perfume: Perfume) => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
    window.location.href = `/collections/${perfume.category}#perfume-${perfume.id}`;
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          className="w-full rounded-full border border-[var(--border)] bg-[#1a120d]/88 py-2.5 pl-10 pr-10 text-sm font-sans text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors placeholder:text-muted-foreground focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-[var(--border)] bg-[#1a120d]/98 shadow-[0_18px_44px_rgba(0,0,0,0.38)]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : searchResults.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No perfumes found
            </div>
          ) : searchResults.length > 0 && (
            <div className="divide-y divide-[var(--border)]">
              {searchResults.map((perfume) => (
                <button
                  key={perfume.id}
                  onClick={() => handleSelectPerfume(perfume)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                >
                  {perfume.imageUrl && (
                    <img
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-sm truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {perfume.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      KSH {parseFloat(String(perfume.price)).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
