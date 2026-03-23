import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartJourney: () => void;
}

const MilkDrop = () => (
  <svg viewBox="0 0 158 218" width="158" height="218" fill="none" aria-hidden="true">
    <path d="M79 8 C114 58 130 100 130 138 C130 175 107 196 79 200 C51 196 28 175 28 138 C28 100 44 58 79 8Z" fill="#00bf63" opacity="0.08"/>
    <path d="M79 22 C110 66 124 104 124 136 C124 170 103 189 79 193 C55 189 34 170 34 136 C34 104 48 66 79 22Z" fill="#00bf63" opacity="0.16"/>
    <path d="M79 40 C106 76 118 108 118 134 C118 165 99 182 79 186 C59 182 40 165 40 134 C40 108 52 76 79 40Z" fill="#00bf63" opacity="0.30"/>
    <ellipse cx="64" cy="102" rx="7" ry="14" fill="white" opacity="0.55" transform="rotate(-14 64 102)"/>
    <ellipse cx="68" cy="82" rx="3" ry="5" fill="white" opacity="0.35" transform="rotate(-14 68 82)"/>
    <circle cx="136" cy="162" r="9" fill="#00bf63" opacity="0.14"/>
    <circle cx="148" cy="147" r="6" fill="#f59e0b" opacity="0.55"/>
    <circle cx="20" cy="168" r="7" fill="#00bf63" opacity="0.12"/>
    <circle cx="12" cy="154" r="4.5" fill="#2144ff" opacity="0.36"/>
    <circle cx="140" cy="178" r="3.5" fill="#00bf63" opacity="0.26"/>
    <circle cx="148" cy="168" r="2.5" fill="#f59e0b" opacity="0.4"/>
  </svg>
);

export const HeroSection = ({ onStartJourney }: HeroSectionProps) => {
  return (
    <>
      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="md:hidden relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-16 -right-12 w-80 h-80 bg-primary/[0.07] rounded-full pointer-events-none" />
        <div className="absolute top-72 -left-16 w-48 h-48 bg-secondary/[0.07] rounded-full pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 pt-6 px-6 min-h-[340px]">
          {/* Floating milk drop */}
          <div
            className="absolute top-16 -right-2 pointer-events-none z-0"
            style={{ animation: "heroFloat 4.5s ease-in-out infinite" }}
          >
            <MilkDrop />
          </div>

          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 mb-5"
            style={{ animation: "heroFadeUp 0.55s ease 0.15s both" }}
          >
            <span
              className="w-2 h-2 bg-primary rounded-full flex-shrink-0"
              style={{ animation: "pulseDot 2.2s ease-in-out infinite" }}
            />
            <span className="text-xs text-primary font-medium">12 new reviews today</span>
          </div>

          {/* Headline */}
          <div
            className="mb-4 relative z-10"
            style={{ animation: "heroFadeUp 0.55s ease 0.28s both" }}
          >
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.045em] text-foreground mb-0.5 max-w-[220px]"
              style={{ fontSize: "52px" }}
            >
              Ditch the Moo.
            </h1>
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.045em] text-primary max-w-[280px]"
              style={{ fontSize: "52px" }}
            >
              Find Your New!
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="text-[14px] leading-relaxed text-muted-foreground mb-5 max-w-[210px] relative z-10"
            style={{ animation: "heroFadeUp 0.55s ease 0.28s both" }}
          >
            Rate, discover & share plant milks with people obsessed with taste.
          </p>

          {/* Use-case chips */}
          <div
            className="flex gap-2 flex-wrap relative z-10"
            style={{ animation: "heroFadeUp 0.55s ease 0.42s both" }}
          >
            <span className="bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-xs text-primary font-medium">Coffee</span>
            <span className="bg-secondary/10 border border-secondary/30 rounded-full px-3 py-1 text-xs text-secondary font-medium">Cereal</span>
            <span className="bg-tertiary/10 border border-tertiary/30 rounded-full px-3 py-1 text-xs text-tertiary font-medium">Cooking</span>
            <span className="bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-xs text-primary font-medium">Baking</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div
          className="px-6 pt-6 flex flex-col gap-3 relative z-10"
          style={{ animation: "heroFadeUp 0.55s ease 0.56s both" }}
        >
          <button
            onClick={onStartJourney}
            className="w-full bg-secondary text-white rounded-[17px] px-5 py-[17px] text-[15px] font-semibold flex items-center justify-between tracking-[-0.2px] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] font-sans"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5C7 1.5 4 5.5 4 8.5C4 10.4 5.3 12 7 12C8.7 12 10 10.4 10 8.5C10 5.5 7 1.5 7 1.5Z" fill="white"/>
                </svg>
              </div>
              Start Your Taste Journey
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <Link
            to="/results"
            className="w-full text-center text-foreground rounded-[17px] px-5 py-4 text-[15px] font-medium ghost-border transition-colors hover:bg-surface-container-low font-sans block"
          >
            Explore Results
          </Link>
        </div>

        <style>{`
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-14px) rotate(-2deg); }
          }
          @keyframes pulseDot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* ── DESKTOP LAYOUT (md+) ── */}
      <div className="hidden md:flex flex-col items-center justify-center text-center relative z-10">
        <div className="mb-4 md:mb-6">
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 text-primary animate-fade-in">
            Ditch the Moo.
            <br />
            Find Your New!
          </h1>
        </div>

        <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl animate-fade-in leading-relaxed">
          Tired of tasteless plant milks? Rate, discover, and share your faves
          with a community that{"'"}s just as obsessed. Whether it{"'"}s for
          coffee, cereal, or cooking—find the dairy-free match that actually delivers.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in mb-8 md:mb-12">
          <Button
            onClick={onStartJourney}
            size="lg"
            className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" className="mr-2 flex-shrink-0">
              <path d="M7 1.5C7 1.5 4 5.5 4 8.5C4 10.4 5.3 12 7 12C8.7 12 10 10.4 10 8.5C10 5.5 7 1.5 7 1.5Z" fill="white"/>
            </svg>
            Start Your Taste Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button asChild variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8">
            <Link to="/results">Explore Results</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
