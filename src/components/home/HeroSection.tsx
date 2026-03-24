import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartJourney: () => void;
  recentReviews?: number;
}

const MilkDrop = () =>
<svg viewBox="0 0 158 218" width="158" height="218" fill="none" aria-hidden="true">
    <path d="M79 8 C114 58 130 100 130 138 C130 175 107 196 79 200 C51 196 28 175 28 138 C28 100 44 58 79 8Z" fill="currentColor" className="text-primary" opacity="0.08" />
    <path d="M79 22 C110 66 124 104 124 136 C124 170 103 189 79 193 C55 189 34 170 34 136 C34 104 48 66 79 22Z" fill="currentColor" className="text-primary" opacity="0.16" />
    <path d="M79 40 C106 76 118 108 118 134 C118 165 99 182 79 186 C59 182 40 165 40 134 C40 108 52 76 79 40Z" fill="currentColor" className="text-primary" opacity="0.30" />
    <ellipse cx="64" cy="102" rx="7" ry="14" fill="white" opacity="0.55" transform="rotate(-14 64 102)" />
    <ellipse cx="68" cy="82" rx="3" ry="5" fill="white" opacity="0.35" transform="rotate(-14 68 82)" />
    <circle cx="136" cy="162" r="9" fill="currentColor" className="text-primary" opacity="0.14" />
    <circle cx="148" cy="147" r="6" fill="currentColor" className="text-tertiary-fixed" opacity="0.55" />
    <circle cx="20" cy="168" r="7" fill="currentColor" className="text-primary" opacity="0.12" />
    <circle cx="140" cy="178" r="3.5" fill="currentColor" className="text-primary" opacity="0.26" />
    <circle cx="148" cy="168" r="2.5" fill="currentColor" className="text-tertiary-fixed" opacity="0.4" />
  </svg>;


export const HeroSection = ({ onStartJourney, recentReviews = 0 }: HeroSectionProps) => {
  const showBadge = recentReviews > 0;
  const badgeText = `${recentReviews} new review${recentReviews !== 1 ? 's' : ''} this week`;
  const fallbackText = "Be the first to review this week";

  return (
    <>
      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="md:hidden relative overflow-hidden">
        {/* Background blob — primary only, larger and purposeful */}
        <div className="absolute -top-16 -right-12 w-80 h-80 bg-primary/[0.06] rounded-full pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 pt-6 px-6 min-h-[340px]">
          {/* Floating milk drop */}
          <div
            className="absolute top-16 -right-2 pointer-events-none z-0"
            style={{ animation: "heroFloat 4.5s ease-in-out infinite" }}>
            
            <MilkDrop />
          </div>

          {/* Live badge */}
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 mb-5 no-underline"
            style={{ animation: "heroFadeUp 0.55s ease 0.15s both" }}>
            
            <span
              className="w-2 h-2 bg-primary rounded-full flex-shrink-0"
              style={{ animation: "pulseDot 2.2s ease-in-out infinite" }} />
            
            <span className="text-xs text-primary font-medium">
              {showBadge ? badgeText : fallbackText}
            </span>
          </Link>

          {/* Headline */}
          <div
            className="mb-4 relative z-10"
            style={{ animation: "heroFadeUp 0.55s ease 0.28s both" }}>
            
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.045em] text-foreground mb-0.5 max-w-[220px]"
              style={{ fontSize: "52px" }}>
              
              Ditch the Moo.
            </h1>
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.045em] text-primary max-w-[280px]"
              style={{ fontSize: "52px" }}>
              
              Find Your New!
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="text-[14px] leading-relaxed text-muted-foreground mb-5 max-w-[260px] relative z-10"
            style={{ animation: "heroFadeUp 0.55s ease 0.28s both" }}>
            
            Rate, discover & share plant milks<br />
            with people obsessed with taste.
          </p>

          {/* Use-case chips — unified primary treatment */}
          <div className="flex gap-2 flex-wrap relative z-10"
          style={{ animation: "heroFadeUp 0.55s ease 0.42s both" }}>
            
            <Link to="/results?barista=true" className="rounded-md px-3 py-1 text-xs text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06]">Barista</Link>
            <Link to="/results?search=Oatly" className="rounded-md px-3 py-1 text-xs text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06]">Oatly</Link>
            <Link to="/results?search=Alpro" className="rounded-md px-3 py-1 text-xs text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06]">Alpro</Link>
            <Link to="/results?search=Coconut" className="rounded-md px-3 py-1 text-xs text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06]">Coconut</Link>
          </div>
        </div>

        {/* CTA buttons */}
        <div
          className="px-6 pt-6 flex flex-col gap-3 relative z-10"
          style={{ animation: "heroFadeUp 0.55s ease 0.56s both" }}>
          
          <button
            onClick={onStartJourney}
            className="w-full bg-secondary text-secondary-foreground rounded-lg px-5 py-[17px] text-[15px] font-semibold flex items-center justify-between tracking-[-0.2px] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] font-sans">
            
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5C7 1.5 4 5.5 4 8.5C4 10.4 5.3 12 7 12C8.7 12 10 10.4 10 8.5C10 5.5 7 1.5 7 1.5Z" fill="white" />
                </svg>
              </div>
              Start Your Taste Journey
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <Link
            to="/results"
            className="w-full text-center text-foreground rounded-lg px-5 py-4 text-[15px] font-medium border border-border transition-colors hover:bg-muted font-sans block">
            
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
        {/* Live badge */}
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6 no-underline animate-fade-in">
          <span
            className="w-2 h-2 bg-primary rounded-full flex-shrink-0"
            style={{ animation: "pulseDot 2.2s ease-in-out infinite" }} />
          <span className="text-sm text-primary font-medium">
            {showBadge ? badgeText : fallbackText}
          </span>
        </Link>

        {/* Headline */}
        <div className="mb-4 md:mb-6 animate-fade-in">
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-[-0.045em] text-foreground mb-1">
            Ditch the Moo.
          </h1>
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-[-0.045em] text-primary">
            Find Your New!
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base lg:text-lg text-muted-foreground mb-6 max-w-lg animate-fade-in leading-relaxed">
          Rate, discover & share plant milks<br />
          with people obsessed with taste.
        </p>

        {/* Use-case chips */}
        <div className="flex gap-2 flex-wrap justify-center mb-8 animate-fade-in">
          <Link to="/results?barista=true" className="rounded-md px-4 py-1.5 text-sm text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.12] transition-colors">Barista</Link>
          <Link to="/results?search=Oatly" className="rounded-md px-4 py-1.5 text-sm text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.12] transition-colors">Oatly</Link>
          <Link to="/results?search=Alpro" className="rounded-md px-4 py-1.5 text-sm text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.12] transition-colors">Alpro</Link>
          <Link to="/results?search=Coconut" className="rounded-md px-4 py-1.5 text-sm text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.12] transition-colors">Coconut</Link>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-row gap-4 animate-fade-in mb-10">
          <button
            onClick={onStartJourney}
            className="bg-secondary text-secondary-foreground rounded-lg px-7 py-4 text-base font-semibold flex items-center gap-3 tracking-[-0.2px] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] font-sans">
            <div className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5C7 1.5 4 5.5 4 8.5C4 10.4 5.3 12 7 12C8.7 12 10 10.4 10 8.5C10 5.5 7 1.5 7 1.5Z" fill="white" />
              </svg>
            </div>
            Start Your Taste Journey
            <ArrowRight className="h-5 w-5" />
          </button>

          <Link
            to="/results"
            className="text-center text-foreground rounded-lg px-7 py-4 text-base font-medium border border-border transition-colors hover:bg-muted font-sans flex items-center">
            Explore Results
          </Link>
        </div>
      </div>
    </>);

};
