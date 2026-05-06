import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { Award, Flame, Gem, Globe2, Hourglass, Moon, Sparkles } from "lucide-react";
import { Link } from "wouter";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";

const categories = [
  { key: "all", label: "All", href: "#collection" },
  { key: "women", label: "Women", href: "/collections/women" },
  { key: "men", label: "Men", href: "/collections/men" },
  { key: "unisex", label: "Unisex", href: "/collections/unisex" },
] as const;

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "arabic", label: "Arabic" },
  { key: "designer", label: "Designer" },
] as const;

const luxuryNotes = [
  { icon: Gem, title: "Exclusive", subtitle: "Fragrances" },
  { icon: Globe2, title: "Arabic & International", subtitle: "Selection" },
  { icon: Hourglass, title: "Long Lasting", subtitle: "Essence" },
  { icon: Award, title: "Premium", subtitle: "Experience" },
];

export default function Home() {
  const [activeType, setActiveType] = useState<"all" | "arabic" | "designer">("all");

  const { data: allPerfumes, isLoading } = trpc.perfumes.list.useQuery();
  const { data: newArrivals = [], isLoading: loadingNewArrivals } = trpc.perfumes.getNewArrivals.useQuery();

  const filtered = (allPerfumes || []).filter((p) => {
    const typeMatch = activeType === "all" || p.type === activeType;
    return typeMatch;
  });

  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden pb-36 pt-20 md:pb-40"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 3, 2, 0.68) 0%, rgba(20, 10, 3, 0.36) 42%, rgba(9, 5, 2, 0.14) 68%, rgba(5, 3, 2, 0.45) 100%), linear-gradient(180deg, rgba(9, 5, 2, 0.08) 0%, rgba(9, 5, 2, 0.30) 58%, #0f0a07 100%), url('/images/lumina.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-[62%] pointer-events-none bg-gradient-to-r from-black/48 via-black/18 to-transparent" />
        <div className="absolute left-[44%] top-[18%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[var(--gold)]/10 blur-[110px]" />
        <div className="absolute right-[8%] bottom-[12%] h-72 w-72 rounded-full bg-amber-700/10 blur-[90px]" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,transparent_18%,transparent_78%,rgba(238,171,78,0.08)_100%)] mix-blend-screen" />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(15,10,7,0.42) 44%, rgba(15,10,7,0.94) 82%, #0f0a07 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-90" />

        <div className="absolute bottom-5 left-1/2 z-10 w-[min(980px,calc(100%-2rem))] -translate-x-1/2">
          <div className="luxury-glass grid grid-cols-2 overflow-hidden rounded-lg md:grid-cols-4">
            {luxuryNotes.map((note, index) => {
              const Icon = note.icon;
              return (
                <div
                  key={note.title}
                  className="relative flex items-center justify-center gap-3 px-4 py-4 md:py-5"
                >
                  {index > 0 && (
                    <span className="absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent opacity-50 md:block" />
                  )}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/45 bg-[var(--gold)]/10 text-[var(--gold-light)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-[var(--gold-light)]">
                      {note.title}
                    </span>
                    <span className="block text-[9px] font-sans uppercase tracking-[0.18em] text-white/60">
                      {note.subtitle}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container relative z-10 px-4 text-left">
          {/* Eyebrow */}
          <p
            className="mb-7 text-xs font-sans font-light uppercase tracking-[0.56em]"
            style={{ color: "oklch(0.82 0.10 76)", textShadow: "0 2px 12px rgba(0,0,0,0.65)" }}
          >
            Modern Arabic Oud
          </p>

          {/* Main headline */}
          <h1
            className="mb-7 max-w-4xl text-6xl font-serif font-light leading-[0.88] sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              color: "white",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.02em",
              textShadow: "0 3px 22px rgba(0,0,0,0.82)",
            }}
          >
            The Art of
            <br />
            <span
              style={{
                color: "oklch(0.78 0.12 76)",
                fontStyle: "italic",
                fontWeight: 300,
                textShadow: "0 3px 18px rgba(0,0,0,0.78), 0 0 20px oklch(0.62 0.12 75 / 0.30)",
              }}
            >
              Scent
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mb-11 max-w-xl text-base font-sans font-light leading-8 md:text-lg"
            style={{ color: "rgba(255,255,255,0.94)", textShadow: "0 2px 12px rgba(0,0,0,0.75)" }}
          >
            A curated house of Arabic oud, glowing amber, and international signatures crafted for those who wear scent like atmosphere.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={scrollToCollection}
              className="rounded-full px-8 py-3.5 text-sm font-sans font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(217,151,56,0.28)]"
              style={{
                background: "linear-gradient(135deg, oklch(0.86 0.09 82), oklch(0.68 0.15 73) 46%, oklch(0.43 0.10 58))",
                color: "#0f0a07",
              }}
            >
              Explore Collection
            </button>
            <button
              onClick={scrollToCollection}
              className="rounded-full border px-8 py-3.5 text-sm font-sans font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              style={{ borderColor: "rgba(229,180,93,0.42)", color: "rgba(255,255,255,0.9)" }}
            >
              View All
            </button>
          </div>
        </div>
      </section>

      {/* Category Banner */}
      <section className="section-champagne section-amber-glow py-16 md:py-24">
        <div className="container relative text-center">
          <div className="divider-gold mb-8 max-w-xs mx-auto" />
          <p className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-3" style={{ color: "var(--gold)" }}>
            Our Collections
          </p>
          <h2
            className="mx-auto mb-12 max-w-3xl text-4xl font-serif font-light leading-tight md:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--foreground)" }}
          >
            Find Your <span className="italic text-[var(--gold-light)]">Signature</span> Scent
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Women", icon: Sparkles, desc: "Floral, ambered and softly opulent", href: "/collections/women" },
              { label: "Men", icon: Flame, desc: "Oud, woods and modern smoky depth", href: "/collections/men" },
              { label: "Unisex", icon: Moon, desc: "Nocturnal signatures for every skin", href: "/collections/unisex" },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.label}
                  href={cat.href}
                  className="group relative flex flex-col items-center overflow-hidden rounded-lg border premium-border p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-[var(--gold)]/55"
                  style={{
                    background:
                      "linear-gradient(145deg, oklch(0.19 0.03 52 / 0.82), oklch(0.08 0.014 42 / 0.94))",
                    boxShadow:
                      "0 22px 70px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute -top-16 h-28 w-28 rounded-full bg-[var(--gold)]/14 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)]/35 bg-[var(--gold)]/10 text-[var(--gold-light)] shadow-[0_0_30px_rgba(205,142,53,0.14)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3
                    className="mb-2 text-2xl font-serif font-light text-cream"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {cat.label}
                  </h3>
                  <p className="text-xs font-sans leading-relaxed text-muted-foreground">{cat.desc}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="section-warm section-amber-glow py-16 md:py-24">
          <div className="container relative">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-3" style={{ color: "var(--gold)" }}>
                Fresh Arrivals
              </p>
              <h2
                className="text-4xl md:text-6xl font-serif font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Latest <span className="italic text-[var(--gold-light)]">Additions</span>
              </h2>
              <p className="text-sm text-muted-foreground font-sans mt-2 max-w-md mx-auto">
                Newly arrived compositions with polished oud, amber and designer intrigue.
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
      <section id="collection" className="section-warm py-16 md:py-24">
        <div className="container relative">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-3" style={{ color: "var(--gold)" }}>
              Curated Selection
            </p>
            <h2
              className="text-4xl md:text-6xl font-serif font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Perfume <span className="italic text-[var(--gold-light)]">Collection</span>
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Category tabs */}
            <div className="luxury-glass flex flex-wrap items-center gap-1 rounded-full p-1">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="rounded-full px-4 py-2 text-xs font-sans font-medium uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  style={
                    cat.key === "all"
                      ? {
                          background: "linear-gradient(135deg, oklch(0.84 0.09 82), oklch(0.60 0.14 70))",
                          color: "#0f0a07",
                        }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Type filter */}
            <div className="luxury-glass flex items-center gap-1 rounded-full p-1">
              {typeFilters.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  className="px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-sans font-medium transition-all duration-200"
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
              activeType !== "all"
                ? "No perfumes match your filters"
                : "No perfumes available yet"
            }
          />
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, oklch(0.62 0.15 66 / 0.18), transparent 30rem), linear-gradient(135deg, #0f0a07, #1a120d 52%, #0f0a07)",
        }}
      >
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-70" />
        <div className="container relative text-center">
          <p
            className="text-xs tracking-[0.4em] uppercase font-sans font-light mb-4"
            style={{ color: "var(--gold)" }}
          >
            Personal Shopping
          </p>
          <h2
            className="text-4xl md:text-6xl font-serif font-light mb-5"
            style={{ color: "oklch(0.95 0.005 60)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Need Help <span className="italic text-[var(--gold-light)]">Choosing?</span>
          </h2>
          <p
            className="text-sm font-sans mb-8 max-w-md mx-auto leading-7"
            style={{ color: "oklch(0.95 0.005 60 / 0.6)" }}
          >
            Our fragrance experts are available on WhatsApp for a quiet, personal recommendation.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like help choosing a perfume from Lumina Glow.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-sans font-medium transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              color: "white",
              boxShadow: "0 18px 48px rgba(0,0,0,0.34), 0 0 34px rgba(37,211,102,0.16)",
            }}
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
