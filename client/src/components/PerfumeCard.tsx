import { MessageCircle, Sparkles } from "lucide-react";
import type { Perfume } from "../../../drizzle/schema";

interface PerfumeCardProps {
  perfume: Perfume;
  whatsappNumber: string;
}

const categoryColors: Record<string, string> = {
  women: "bg-[var(--gold)]/10 text-[var(--gold-light)] border-[var(--gold)]/30",
  men: "bg-white/5 text-[var(--cream)] border-white/15",
  unisex: "bg-[var(--gold-dark)]/15 text-[var(--gold-light)] border-[var(--gold)]/25",
};

const categoryLabels: Record<string, string> = {
  women: "Women",
  men: "Men",
  unisex: "Unisex",
};

const categorySignoffs: Record<string, string> = {
  women: "\u2665",
  men: "\u2605",
  unisex: "\u2726",
};

const typeLabels: Record<string, string> = {
  arabic: "Arabic",
  designer: "Designer",
};

export default function PerfumeCard({ perfume, whatsappNumber }: PerfumeCardProps) {
  const imageUrl = perfume.imageUrl || `https://placehold.co/400x500/f5f0e8/c9a96e?text=${encodeURIComponent(perfume.name)}`;
  const absoluteImageUrl = imageUrl.startsWith("/")
    ? `${window.location.origin}${imageUrl}`
    : imageUrl;

  const handleWhatsApp = () => {
    const priceFormatted = parseFloat(String(perfume.price)).toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    });
    const closingLine = categorySignoffs[perfume.category] ?? "\u2726";
    const message = encodeURIComponent(
      `Hello! I'm interested in purchasing:\n\n*${perfume.name}*\nCategory: ${categoryLabels[perfume.category]}\nType: ${typeLabels[perfume.type]}\nPrice: ${priceFormatted}\n\nProduct Image: ${absoluteImageUrl}\n\nPlease let me know about availability and payment details.\n\nThank you! ${closingLine}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div
      id={`perfume-${perfume.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border premium-border bg-card card-hover luxury-shadow scroll-mt-28 target:ring-2 target:ring-[var(--gold)] target:ring-offset-4 target:ring-offset-background"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-90" />
      {/* Image */}
      <div className="relative overflow-hidden bg-[var(--muted)] aspect-[4/5]">
        <img
          src={imageUrl}
          alt={perfume.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f0a07]/72 via-transparent to-white/5 opacity-80" />
        {/* Type badge overlay */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase font-sans font-medium"
            style={{
              background: perfume.type === "arabic"
                ? "oklch(0.70 0.13 76 / 0.86)"
                : "oklch(0.12 0.018 42 / 0.82)",
              color: perfume.type === "arabic" ? "#0f0a07" : "white",
              backdropFilter: "blur(4px)",
            }}
          >
            {perfume.type === "arabic" && <Sparkles className="w-2.5 h-2.5" />}
            {typeLabels[perfume.type]}
          </span>
        </div>
        {/* Out of stock overlay */}
        {perfume.inStock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm tracking-widest uppercase font-sans">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Category badge */}
        <div>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-sans font-medium border ${categoryColors[perfume.category]}`}
          >
            {categoryLabels[perfume.category]}
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-xl font-serif font-light leading-tight text-card-foreground line-clamp-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {perfume.name}
        </h3>

        {/* Description */}
        {perfume.description && (
          <p className="text-xs text-muted-foreground font-sans leading-relaxed line-clamp-2">
            {perfume.description}
          </p>
        )}

        {/* Price + Button */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
          <span
            className="text-xl font-serif font-semibold"
            style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            KSH {parseFloat(String(perfume.price)).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>

          <button
            onClick={handleWhatsApp}
            disabled={perfume.inStock === 0}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-sans font-medium uppercase tracking-[0.1em] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: perfume.inStock !== 0 ? "linear-gradient(135deg, #25D366, #128C7E)" : undefined,
              backgroundColor: perfume.inStock === 0 ? "var(--muted)" : undefined,
              color: "white",
            }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
