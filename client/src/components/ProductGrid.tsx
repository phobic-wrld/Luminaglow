import PerfumeCard from "./PerfumeCard";
import type { Perfume } from "../../../drizzle/schema";
import { Sparkles } from "lucide-react";

interface ProductGridProps {
  perfumes: Perfume[];
  loading?: boolean;
  whatsappNumber: string;
  emptyMessage?: string;
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-[var(--border)] animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-muted rounded-full" />
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-2/3 bg-muted rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-16 bg-muted rounded" />
          <div className="h-8 w-20 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ perfumes, loading, whatsappNumber, emptyMessage }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!perfumes || perfumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Sparkles className="w-10 h-10 mb-4 opacity-30" style={{ color: "var(--gold)" }} />
        <p
          className="text-xl font-serif font-light mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--muted-foreground)" }}
        >
          {emptyMessage || "No perfumes available yet"}
        </p>
        <p className="text-sm font-sans text-muted-foreground">
          Check back soon for our curated collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {perfumes.map((perfume) => (
        <PerfumeCard key={perfume.id} perfume={perfume} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  );
}
