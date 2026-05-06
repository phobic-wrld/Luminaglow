import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Gem, Hourglass, MessageCircle, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";

const experienceItems = [
  {
    icon: Gem,
    title: "Exclusive Fragrances",
    text: "Distinctive Arabic and international scents selected for presence, rarity, and elegance.",
  },
  {
    icon: Hourglass,
    title: "Long Lasting Essence",
    text: "Compositions chosen for depth, trail, and the slow warmth they leave on skin.",
  },
  {
    icon: Sparkles,
    title: "Curated Collections",
    text: "A focused edit of oud, amber, florals, woods, and designer signatures.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Assistance",
    text: "A personal concierge experience to help match mood, occasion, and identity.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-screen items-end overflow-hidden pb-20 pt-32 md:pb-24">
        <img
          src="/images/abow.jpg"
          alt="Lumina Glow cinematic fragrance campaign"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 42%" }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,10,7,0.82)_0%,rgba(26,18,13,0.56)_42%,rgba(15,10,7,0.18)_72%,rgba(15,10,7,0.52)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,7,0.10)_0%,rgba(15,10,7,0.22)_52%,#0f0a07_100%)]" />
        <div className="ambient-glow absolute left-[12%] top-[18%] h-80 w-80 md:h-[30rem] md:w-[30rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,transparent_20%,transparent_78%,rgba(232,163,70,0.06)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-80" />

        <div className="container relative z-10">
          <div className="max-w-4xl">
            <p
              className="mb-5 text-xs font-sans font-light uppercase tracking-[0.56em]"
              style={{ color: "var(--gold-light)", textShadow: "0 2px 14px rgba(0,0,0,0.72)" }}
            >
              Lumina Glow
            </p>
            <h1
              className="mb-7 text-6xl font-serif font-light leading-[0.88] sm:text-7xl md:text-8xl lg:text-9xl"
              style={{
                color: "oklch(0.97 0.014 78)",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.02em",
                textShadow: "0 4px 28px rgba(0,0,0,0.78)",
              }}
            >
              Fragrance as
              <span className="block italic text-[var(--gold-light)]">Memory</span>
            </h1>
            <p className="max-w-xl text-base font-sans font-light leading-8 text-white/75 md:text-lg">
              A cinematic house of Arabic oud, amber warmth, and international signatures curated for the way scent becomes identity.
            </p>
          </div>
        </div>
      </section>

      <section className="section-warm section-amber-glow content-visibility-auto py-20 md:py-28">
        <div className="container relative">
          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="relative overflow-hidden rounded-lg border premium-border luxury-shadow">
              <img
                src="/images/abom.jpg"
                alt="Lumina Glow oud and luxury fragrance editorial"
                className="aspect-[4/5] h-full w-full object-cover transition-transform duration-300 hover:scale-[1.015]"
                style={{ objectPosition: "center 44%" }}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a07]/70 via-transparent to-white/5" />
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-70" />
            </div>

            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-sans font-light uppercase tracking-[0.46em] text-[var(--gold)]">
                Brand Story
              </p>
              <h2
                className="mb-7 text-4xl font-serif font-light leading-tight md:text-6xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                A scent should feel
                <span className="block italic text-[var(--gold-light)]">chosen, not sold.</span>
              </h2>
              <div className="space-y-5 text-sm font-sans font-light leading-8 text-muted-foreground md:text-base">
                <p>
                  Lumina Glow was created for people who understand that fragrance is not decoration. It is atmosphere, memory, and the quiet signature that enters a room before words do.
                </p>
                <p>
                  Our philosophy blends modern Arabic oud luxury with international perfume craft: smoky woods, glowing amber, refined florals, and designer compositions edited with restraint.
                </p>
                <p>
                  Every bottle is selected to feel personal, polished, and lasting, creating a curated scent experience for daily ritual, evening presence, and unforgettable moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-champagne content-visibility-auto py-20 md:py-28">
        <div className="container relative">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs font-sans font-light uppercase tracking-[0.46em] text-[var(--gold)]">
              The Experience
            </p>
            <h2
              className="text-4xl font-serif font-light leading-tight md:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Luxury made intimate,
              <span className="block italic text-[var(--gold-light)]">warm, and exacting.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
            <div className="grid gap-4 sm:grid-cols-2">
              {experienceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group relative overflow-hidden rounded-lg border premium-border p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/55"
                    style={{
                      background:
                        "linear-gradient(145deg, oklch(0.19 0.03 52 / 0.82), oklch(0.08 0.014 42 / 0.94))",
                      boxShadow:
                        "0 18px 44px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/35 bg-[var(--gold)]/10 text-[var(--gold-light)] shadow-[0_0_18px_rgba(205,142,53,0.12)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-3 text-2xl font-serif font-light text-cream">
                      {item.title}
                    </h3>
                    <p className="text-sm font-sans font-light leading-7 text-muted-foreground">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="relative min-h-[28rem] overflow-hidden rounded-lg border premium-border luxury-shadow">
              <img
                src="/images/abouu.jpg"
                alt="Lumina Glow niche fragrance editorial visual"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-[1.015]"
                style={{ objectPosition: "center 44%" }}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,7,0.08)_0%,rgba(15,10,7,0.18)_50%,rgba(15,10,7,0.78)_100%)]" />
              <div className="absolute bottom-6 left-6 right-6 luxury-glass rounded-lg p-6">
                <p className="mb-2 text-[10px] font-sans uppercase tracking-[0.32em] text-[var(--gold-light)]">
                  Personal Edit
                </p>
                <p className="text-sm font-sans font-light leading-7 text-white/72">
                  We guide each discovery with mood, season, occasion, and skin chemistry in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[70vh] items-end overflow-hidden py-20 md:min-h-[78vh] md:py-24">
        <img
          src="/images/about.jpg"
          alt="Lumina Glow signature scent luxury campaign"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center center" }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,10,7,0.88)_0%,rgba(26,18,13,0.58)_42%,rgba(15,10,7,0.22)_74%,rgba(15,10,7,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,7,0.26)_0%,rgba(15,10,7,0.14)_42%,#0f0a07_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,transparent_24%,transparent_78%,rgba(232,163,70,0.07)_100%)]" />
        <div className="ambient-glow absolute right-[12%] top-[18%] h-80 w-80 md:h-[28rem] md:w-[28rem]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent opacity-75" />

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-sans font-light uppercase tracking-[0.46em] text-[var(--gold-light)]">
              Concierge
            </p>
            <h2
              className="mb-7 text-5xl font-serif font-light leading-[0.95] md:text-7xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 4px 26px rgba(0,0,0,0.74)" }}
            >
              Discover Your
              <span className="block italic text-[var(--gold-light)]">Signature Scent</span>
            </h2>
            <p className="mb-9 max-w-lg text-sm font-sans font-light leading-7 text-white/72 md:text-base">
              Enter a quieter kind of luxury, guided personally toward the fragrance that feels rare, intimate, and unforgettable.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Lumina Glow. I'd like help discovering my signature scent.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-sans font-medium uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, oklch(0.86 0.09 82), oklch(0.68 0.15 73) 46%, oklch(0.43 0.10 58))",
                color: "#0f0a07",
                boxShadow: "0 18px 48px rgba(0,0,0,0.34), 0 0 34px rgba(217,151,56,0.20)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
