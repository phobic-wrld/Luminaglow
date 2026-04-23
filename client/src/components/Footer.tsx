import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-24 border-t border-[var(--border)]"
      style={{ background: "oklch(0.15 0.01 40)" }}
    >
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <div
                className="text-3xl font-serif font-light tracking-widest"
                style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}
              >
                LUMINA
              </div>
              <div
                className="text-xs tracking-[0.35em] uppercase font-sans font-light"
                style={{ color: "oklch(0.95 0.005 60 / 0.5)", marginTop: "-2px" }}
              >
                GLOW
              </div>
            </div>
            <p className="text-sm font-sans leading-relaxed" style={{ color: "oklch(0.95 0.005 60 / 0.55)" }}>
              Curated luxury fragrances — Arabic oud and international designer perfumes for every soul.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-xs tracking-[0.25em] uppercase font-sans font-medium mb-5"
              style={{ color: "var(--gold)" }}
            >
              Collections
            </h4>
            <ul className="flex flex-col gap-3">
              {["All Perfumes", "Women", "Men", "Unisex"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "All Perfumes" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm font-sans transition-colors duration-200"
                    style={{ color: "oklch(0.95 0.005 60 / 0.55)" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "oklch(0.95 0.005 60 / 0.55)")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs tracking-[0.25em] uppercase font-sans font-medium mb-5"
              style={{ color: "var(--gold)" }}
            >
              Contact
            </h4>
            <p className="text-sm font-sans mb-4" style={{ color: "oklch(0.95 0.005 60 / 0.55)" }}>
              Order via WhatsApp for a personal shopping experience.
            </p>
            <div
              className="inline-flex items-center gap-2 text-sm font-sans"
              style={{ color: "oklch(0.95 0.005 60 / 0.7)" }}
            >
              <MessageCircle className="w-4 h-4" style={{ color: "#25D366" }} />
              Available on WhatsApp
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 divider-gold" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans" style={{ color: "oklch(0.95 0.005 60 / 0.35)" }}>
            © {new Date().getFullYear()} Lumina Glow. All rights reserved.
          </p>
          <p className="text-xs font-sans" style={{ color: "oklch(0.95 0.005 60 / 0.35)" }}>
            Luxury Fragrances — Arabic & Designer
          </p>
        </div>
      </div>
    </footer>
  );
}
