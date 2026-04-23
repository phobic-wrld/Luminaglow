import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";

const categoryMeta = {
  women: {
    label: "Women",
    tagline: "Feminine Elegance",
    description: "Floral, oriental, and feminine fragrances crafted for the modern woman.",
    icon: "🌸",
    gradient: "linear-gradient(160deg, oklch(0.14 0.01 10) 0%, oklch(0.20 0.03 20) 100%)",
  },
  men: {
    label: "Men",
    tagline: "Masculine Distinction",
    description: "Woody, fresh, and bold scents for the confident man.",
    icon: "🌿",
    gradient: "linear-gradient(160deg, oklch(0.12 0.01 220) 0%, oklch(0.18 0.02 200) 100%)",
  },
  unisex: {
    label: "Unisex",
    tagline: "Beyond Boundaries",
    description: "Versatile fragrances that transcend gender — for every soul.",
    icon: "✨",
    gradient: "linear-gradient(160deg, oklch(0.12 0.01 280) 0%, oklch(0.18 0.02 260) 100%)",
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

  const filtered = (perfumes || []).filter((p) =>
    activeType === "all" ? true : p.type === activeType
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section
        className="relative flex items-end pb-16 pt-32 md:pt-40 overflow-hidden"
        style={{ background: meta.gradient, minHeight: "40vh" }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "var(--gold)" }}
        />
        <div className="container relative z-10">
          <p
            className="text-xs tracking-[0.5em] uppercase font-sans font-light mb-3"
            style={{ color: "var(--gold)" }}
          >
            {meta.tagline}
          </p>
          <h1
            className="text-4xl md:text-6xl font-serif font-light mb-4"
            style={{
              color: "oklch(0.95 0.005 60)",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.03em",
            }}
          >
            {meta.icon} {meta.label}
          </h1>
          <p
            className="text-sm md:text-base font-sans font-light max-w-md"
            style={{ color: "oklch(0.95 0.005 60 / 0.6)" }}
          >
            {meta.description}
          </p>
        </div>
      </section>

      {/* Collection */}
      <section className="py-16 md:py-24 flex-1">
        <div className="container">
          {/* Type filter */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
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
