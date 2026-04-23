import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { ChevronDown } from "lucide-react";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";

const categories = [
  { key: "all", label: "All" },
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "unisex", label: "Unisex" },
] as const;

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "arabic", label: "Arabic" },
  { key: "designer", label: "Designer" },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"all" | "women" | "men" | "unisex">("all");
  const [activeType, setActiveType] = useState<"all" | "arabic" | "designer">("all");

  const { data: allPerfumes, isLoading } = trpc.perfumes.list.useQuery();
  const { data: newArrivals = [], isLoading: loadingNewArrivals } = trpc.perfumes.getNewArrivals.useQuery();

  const filtered = (allPerfumes || []).filter((p) => {
    const catMatch = activeCategory === "all" || p.category === activeCategory;
    const typeMatch = activeType === "all" || p.type === activeType;
    return catMatch && typeMatch;
  });

  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.12 0.01 40) 0%, oklch(0.18 0.02 55) 50%, oklch(0.14 0.015 45) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "var(--gold)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.82 0.08 75)" }}
        />

        <div className="container relative z-10 text-center px-4">
          {/* Eyebrow */}
          <p
            className="text-xs tracking-[0.5em] uppercase font-sans font-light mb-6"
            style={{ color: "var(--gold)" }}
          >
            Luxury Fragrances
          </p>

          {/* Main headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light leading-none mb-6"
            style={{
              color: "oklch(0.95 0.005 60)",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.04em",
            }}
          >
            The Art of
            <br />
            <span style={{ color: "var(--gold)", fontStyle: "italic" }}>Scent</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg font-sans font-light max-w-md mx-auto mb-10 leading-relaxed"
            style={{ color: "oklch(0.95 0.005 60 / 0.6)" }}
          >
            Discover our curated collection of Arabic oud and international designer perfumes — crafted for those who wear their story.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCollection}
              className="px-8 py-3.5 rounded-full text-sm tracking-[0.15em] uppercase font-sans font-medium transition-all duration-300 hover:opacity-90 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.50 0.10 65))",
                color: "white",
              }}
            >
              Explore Collection
            </button>
            <button
              onClick={scrollToCollection}
              className="px-8 py-3.5 rounded-full text-sm tracking-[0.15em] uppercase font-sans font-medium border transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: "oklch(0.95 0.005 60 / 0.3)", color: "oklch(0.95 0.005 60 / 0.7)" }}
            >
              View All
            </button>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToCollection}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-opacity"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans" style={{ color: "oklch(0.95 0.005 60)" }}>
              Scroll
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: "oklch(0.95 0.005 60)" }} />
          </button>
        </div>
      </section>

      {/* Category Banner */}
      <section className="py-16 md:py-20" style={{ background: "var(--cream, oklch(0.98 0.01 80))" }}>
        <div className="container text-center">
          <div className="divider-gold mb-8 max-w-xs mx-auto" />
          <p className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-3" style={{ color: "var(--gold)" }}>
            Our Collections
          </p>
          <h2
            className="text-3xl md:text-4xl font-serif font-light mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--foreground)" }}
          >
            Find Your Signature Scent
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Women", icon: "🌸", desc: "Floral, oriental & feminine fragrances", href: "/women", color: "oklch(0.95 0.03 15)" },
              { label: "Men", icon: "🌿", desc: "Woody, fresh & masculine scents", href: "/men", color: "oklch(0.94 0.02 220)" },
              { label: "Unisex", icon: "✨", desc: "Versatile scents for every soul", href: "/unisex", color: "oklch(0.94 0.03 280)" },
            ].map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className="group flex flex-col items-center p-8 rounded-xl border border-[var(--border)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                style={{ background: cat.color }}
              >
                <span className="text-3xl mb-3">{cat.icon}</span>
                <h3
                  className="text-xl font-serif font-medium mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {cat.label}
                </h3>
                <p className="text-xs font-sans text-muted-foreground text-center">{cat.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-3" style={{ color: "var(--gold)" }}>
                Fresh Arrivals
              </p>
              <h2
                className="text-3xl md:text-4xl font-serif font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Latest Additions
              </h2>
              <p className="text-sm text-muted-foreground font-sans mt-2 max-w-md mx-auto">
                Discover our newest curated fragrances
              </p>
            </div>
            <ProductGrid
              perfumes={newArrivals}
              loading={loadingNewArrivals}
              whatsappNumber={WHATSAPP_NUMBER}
              emptyMessage="No new arrivals yet"
            />
          </div>
        </section>
      )}

      {/* Collection Section */}
      <section id="collection" className="py-16 md:py-24">
        <div className="container">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-3" style={{ color: "var(--gold)" }}>
              Curated Selection
            </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Perfume Collection
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Category tabs */}
            <div className="flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-card">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-sans font-medium transition-all duration-200"
                  style={
                    activeCategory === cat.key
                      ? {
                          background: "linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.50 0.10 65))",
                          color: "white",
                        }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-card">
              {typeFilters.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  className="px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-sans font-medium transition-all duration-200"
                  style={
                    activeType === t.key
                      ? { background: "var(--foreground)", color: "var(--background)" }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          {!isLoading && (
            <p className="text-xs font-sans text-muted-foreground mb-6">
              {filtered.length} {filtered.length === 1 ? "perfume" : "perfumes"} found
            </p>
          )}

          <ProductGrid
            perfumes={filtered}
            loading={isLoading}
            whatsappNumber={WHATSAPP_NUMBER}
            emptyMessage={
              activeCategory !== "all" || activeType !== "all"
                ? "No perfumes match your filters"
                : "No perfumes available yet"
            }
          />
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section
        className="py-16 md:py-20"
        style={{
          background: "linear-gradient(135deg, oklch(0.12 0.01 40), oklch(0.20 0.02 55))",
        }}
      >
        <div className="container text-center">
          <p
            className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-4"
            style={{ color: "var(--gold)" }}
          >
            Personal Shopping
          </p>
          <h2
            className="text-3xl md:text-4xl font-serif font-light mb-4"
            style={{ color: "oklch(0.95 0.005 60)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Need Help Choosing?
          </h2>
          <p
            className="text-sm font-sans mb-8 max-w-md mx-auto"
            style={{ color: "oklch(0.95 0.005 60 / 0.6)" }}
          >
            Our fragrance experts are available on WhatsApp to help you find your perfect scent.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like help choosing a perfume from Lumina Glow.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-sans font-medium transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "white" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
