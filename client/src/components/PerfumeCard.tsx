import { MessageCircle, Sparkles } from "lucide-react";
import type { Perfume } from "../../../drizzle/schema";

interface PerfumeCardProps {
  perfume: Perfume;
  whatsappNumber: string;
}

const categoryColors: Record<string, string> = {
  women: "bg-pink-50 text-pink-700 border-pink-200",
  men: "bg-blue-50 text-blue-700 border-blue-200",
  unisex: "bg-purple-50 text-purple-700 border-purple-200",
};

const categoryLabels: Record<string, string> = {
  women: "Women",
  men: "Men",
  unisex: "Unisex",
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
    const message = encodeURIComponent(
      `Hello! I'm interested in purchasing:\n\n*${perfume.name}*\nCategory: ${categoryLabels[perfume.category]}\nType: ${typeLabels[perfume.type]}\nPrice: ${priceFormatted}\n\n🖼️ Product Image: ${absoluteImageUrl}\n\nPlease let me know about availability and payment details. Thank you! 🌸`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div
      id={`perfume-${perfume.id}`}
      className="group bg-card rounded-lg overflow-hidden card-hover luxury-shadow border border-[var(--border)] flex flex-col scroll-mt-28"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[var(--muted)] aspect-[3/4]">
        <img
          src={imageUrl}
          alt={perfume.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Type badge overlay */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase font-sans font-medium"
            style={{
              background: perfume.type === "arabic"
                ? "oklch(0.62 0.12 75 / 0.9)"
                : "oklch(0.18 0.01 40 / 0.85)",
              color: "white",
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
      <div className="p-4 flex flex-col flex-1 gap-3">
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
          className="text-lg font-serif font-medium leading-tight text-card-foreground line-clamp-2"
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
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)]">
          <span
            className="text-xl font-serif font-semibold"
            style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            KSH {parseFloat(String(perfume.price)).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>

          <button
            onClick={handleWhatsApp}
            disabled={perfume.inStock === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.1em] uppercase font-sans font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
