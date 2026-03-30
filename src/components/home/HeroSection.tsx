import { Link } from "react-router-dom";
import { ArrowRight, Search, Plus } from "lucide-react";

interface HeroSectionProps {
  onStartJourney: () => void;
  recentReviews?: number;
}

const MilkDrop = () => (
  <svg viewBox="0 0 120 160" width="120" height="160" fill="none" aria-hidden="true">
    {/* Clean, minimal milk drop shape */}
    <defs>
      <linearGradient id="dropGrad" x1="60" y1="0" x2="60" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
      </linearGradient>
    </defs>
    <path
      d="M60 12 C88 52 100 84 100 108 C100 136 82 152 60 152 C38 152 20 136 20 108 C20 84 32 52 60 12Z"
      fill="url(#dropGrad)"
    />
    {/* Highlight */}
    <ellipse cx="48" cy="80" rx="5" ry="12" fill="white" opacity="0.4" transform="rotate(-12 48 80)" />
    <ellipse cx="51" cy="65" rx="2.5" ry="4" fill="white" opacity="0.25" transform="rotate(-12 51 65)" />
  </svg>
);

const quickLinks = [
  { label: "Oat", to: "/results?search=Oat" },
  { label: "Almond", to: "/results?search=Almond" },
  { label: "Soy", to: "/results?search=Soy" },
  { label: "Coconut", to: "/results?search=Coconut" },
  { label: "Barista", to: "/results?barista=true" },
  { label: "Oatly", to: "/results?search=Oatly" },
  { label: "Alpro", to: "/results?search=Alpro" },
];

export const HeroSection = ({ onStartJourney, recentReviews = 0 }: HeroSectionProps) => {
  const showBadge = recentReviews > 0;
  const badgeText = `${recentReviews} new review${recentReviews !== 1 ? 's' : ''} this week`;
  const fallbackText = "Be the first to review this week";

  return (
    <>
      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="md:hidden relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute -top-20 -right-16 w-72 h-72 bg-primary/[0.04] rounded-full pointer-events-none" />

        <div className="relative z-10 pt-6 px-6">
          {/* Floating milk drop — cleaner version */}
          <div
            className="absolute top-14 -right-1 pointer-events-none z-0 opacity-80"
            style={{ animation: "heroFloat 5s ease-in-out infinite" }}
          >
            <MilkDrop />
          </div>

          {/* Live badge */}
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 mb-5 no-underline"
            style={{ animation: "heroFadeUp 0.55s ease 0.15s both" }}
          >
            <span
              className="w-2 h-2 bg-primary rounded-full flex-shrink-0"
              style={{ animation: "pulseDot 2.2s ease-in-out infinite" }}
            />
            <span className="text-xs text-primary font-medium">
              {showBadge ? badgeText : fallbackText}
            </span>
          </Link>

          {/* Headline */}
          <div
            className="mb-3 relative z-10"
            style={{ animation: "heroFadeUp 0.55s ease 0.28s both" }}
          >
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.045em] text-foreground mb-0.5 max-w-[220px]"
              style={{ fontSize: "48px" }}
            >
              Ditch the Moo.
            </h1>
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.045em] text-primary max-w-[280px]"
              style={{ fontSize: "48px" }}
            >
              Find Your New!
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="text-[14px] leading-relaxed text-muted-foreground mb-6 max-w-[260px] relative z-10"
            style={{ animation: "heroFadeUp 0.55s ease 0.35s both" }}
          >
            Rate, discover & share plant milks<br />
            with people obsessed with taste.
          </p>
        </div>

        {/* Two clear action cards */}
        <div
          className="px-6 flex flex-col gap-3 relative z-10"
          style={{ animation: "heroFadeUp 0.55s ease 0.45s both" }}
        >
          {/* Primary action: Find the best milk */}
          <Link
            to="/results"
            className="w-full bg-card border border-border rounded-xl px-5 py-4 no-underline flex items-center gap-4 transition-colors hover:bg-muted active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[15px] font-semibold text-foreground block">Find the best milk</span>
              <span className="text-xs text-muted-foreground">Browse ratings & reviews</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </Link>

          {/* Secondary action: Rate a milk */}
          <button
            onClick={onStartJourney}
            className="w-full bg-primary text-primary-foreground rounded-xl px-5 py-4 flex items-center gap-4 transition-[filter,transform] hover:brightness-110 active:scale-[0.98] font-sans text-left"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[15px] font-semibold block">Rate a milk</span>
              <span className="text-xs text-primary-foreground/70">Log what you just tried</span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary-foreground/70 flex-shrink-0" />
          </button>
        </div>

        {/* Quick discovery chips */}
        <div
          className="px-6 pt-5 pb-2 relative z-10"
          style={{ animation: "heroFadeUp 0.55s ease 0.55s both" }}
        >
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Popular
          </span>
          <div className="flex gap-2 flex-wrap">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-full px-3 py-1 text-xs text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06] active:bg-primary/[0.12] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-12px) rotate(0deg); }
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
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-md px-4 py-1.5 text-sm text-primary font-medium no-underline border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.12] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-row gap-4 animate-fade-in mb-10">
          <Link
            to="/results"
            className="text-center text-foreground rounded-lg px-7 py-4 text-base font-medium border border-border transition-colors hover:bg-muted font-sans flex items-center gap-2">
            <Search className="w-4 h-4" />
            Find the Best Milk
          </Link>

          <button
            onClick={onStartJourney}
            className="bg-primary text-primary-foreground rounded-lg px-7 py-4 text-base font-semibold flex items-center gap-3 tracking-[-0.2px] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] font-sans">
            <Plus className="w-5 h-5" />
            Rate a Milk
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};
