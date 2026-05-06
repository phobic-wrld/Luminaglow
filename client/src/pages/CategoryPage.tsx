import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";

const categoryMeta = {
  women: {
    label: "Women",
    tagline: "Feminine Oud Rituals",
    description: "Ambered florals, soft woods, and luminous signatures composed with quiet opulence.",
    image: "/images/luw.jpg",
    imagePosition: "center 42%",
    glowPosition: "left-[12%] top-[18%]",
    overlay:
      "linear-gradient(90deg, rgba(15,10,7,0.78) 0%, rgba(38,18,9,0.48) 42%, rgba(15,10,7,0.20) 72%, rgba(15,10,7,0.46) 100%)",
    accent: "Warm Amber",
  },
  men: {
    label: "Men",
    tagline: "Noir Oud Signatures",
    description: "Bold woods, resinous smoke, and polished gold depth for a sharper evening presence.",
    image: "/images/lum.jpg",
    imagePosition: "center 40%",
    glowPosition: "right-[16%] top-[22%]",
    overlay:
      "linear-gradient(90deg, rgba(5,4,3,0.86) 0%, rgba(12,8,5,0.58) 44%, rgba(5,4,3,0.24) 72%, rgba(5,4,3,0.58) 100%)",
    accent: "Deep Black Gold",
  },
  unisex: {
    label: "Unisex",
    tagline: "Niche House Editions",
    description: "Balanced amber, skin woods, and artistic contrasts made to move beyond convention.",
    image: "/images/luu.jpg",
    imagePosition: "center 44%",
    glowPosition: "left-[46%] top-[16%]",
    overlay:
      "linear-gradient(90deg, rgba(15,10,7,0.80) 0%, rgba(26,18,13,0.52) 42%, rgba(15,10,7,0.18) 72%, rgba(15,10,7,0.48) 100%)",
    accent: "Neutral Amber",
  },
};

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "arabic", label: "Arabic" },
  { key: "designer", label: "Designer" },
] as const;

interface CategoryPageProps {
  category: "women" | "men" | "unisex";
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [activeType, setActiveType] = useState<"all" | "arabic" | "designer">("all");
  const meta = categoryMeta[category];

  const { data: perfumes, isLoading } = trpc.perfumes.listByCategory.useQuery({ category });

  const filtered = useMemo(
    () => (perfumes || []).filter((p) => activeType === "all" || p.type === activeType),
    [activeType, perfumes]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[74vh] items-end overflow-hidden pb-16 pt-32 md:min-h-[82vh] md:pb-20 md:pt-40">
        <img
          src={meta.image}
          alt={`${meta.label} Lumina Glow fragrance campaign`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: meta.imagePosition }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0" style={{ background: meta.overlay }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,7,0.18)_0%,rgba(15,10,7,0.10)_48%,rgba(15,10,7,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,transparent_20%,transparent_78%,rgba(232,163,70,0.055)_100%)]" />
        <div className={`ambient-glow absolute ${meta.glowPosition} h-64 w-64 md:h-80 md:w-80`} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-80" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="luxury-glass mb-8 inline-flex items-center gap-3 rounded-full px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_16px_rgba(229,173,76,0.65)]" />
              <span className="text-[10px] font-sans uppercase tracking-[0.32em] text-[var(--gold-light)]">
                {meta.accent}
              </span>
            </div>
            <p
              className="mb-4 text-xs font-sans font-light uppercase tracking-[0.52em]"
              style={{ color: "var(--gold-light)", textShadow: "0 2px 14px rgba(0,0,0,0.72)" }}
            >
              {meta.tagline}
            </p>
            <h1
              className="mb-6 text-6xl font-serif font-light leading-[0.9] sm:text-7xl md:text-8xl lg:text-9xl"
              style={{
                color: "oklch(0.97 0.014 78)",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.025em",
                textShadow: "0 4px 28px rgba(0,0,0,0.78)",
              }}
            >
              {meta.label}
              <span className="block italic text-[var(--gold-light)]">Collection</span>
            </h1>
            <p
              className="max-w-xl text-sm font-sans font-light leading-7 md:text-base"
              style={{ color: "rgba(245,238,225,0.76)", textShadow: "0 2px 12px rgba(0,0,0,0.72)" }}
            >
              {meta.description}
            </p>
          </div>
        </div>
      </section>

      {/* Collection */}
      <section className="content-visibility-auto py-16 md:py-24 flex-1 section-warm">
        <div className="container relative">
          {/* Type filter */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="luxury-glass flex items-center gap-1 rounded-full p-1">
              {typeFilters.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  className="px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-sans font-medium transition-colors duration-200"
                  style={
                    activeType === t.key
                      ? { background: "rgba(255,255,255,0.90)", color: "#0f0a07" }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
            {!isLoading && (
              <p className="text-xs font-sans text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "perfume" : "perfumes"}
              </p>
            )}
          </div>

          <ProductGrid
            perfumes={filtered}
            loading={isLoading}
            whatsappNumber={WHATSAPP_NUMBER}
            emptyMessage={`No ${meta.label.toLowerCase()} perfumes available yet`}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
