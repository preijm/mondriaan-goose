interface TrustIndicatorItem {
  value: number;
  label: string;
  colorClass: string;
  delayClass?: string;
}

interface TrustIndicatorsProps {
  items: TrustIndicatorItem[];
  formatNumber: (num: number) => string;
}

export const TrustIndicators = ({ items, formatNumber }: TrustIndicatorsProps) => {
  return (
    <>
      {/* Mobile: stats card with colored accent bars */}
      <div
        className="md:hidden mx-6 mt-5 mb-6 rounded-[17px] py-5 px-2 grid grid-cols-3 bg-surface-container-lowest"
        style={{ animation: "heroFadeUp 0.55s ease 0.70s both" }}
      >
        {items.map((item, index) => {
          const accentColors = ['bg-primary', 'bg-secondary', 'bg-muted-foreground/40'];
          return (
            <div
              key={index}
              className={`text-center px-2 ${index > 0 ? "border-l border-gray-300/30" : ""}`}
            >
              <div className="text-[32px] font-extrabold text-foreground tracking-[-1px] leading-none font-display">
                {formatNumber(item.value)}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1.5 font-semibold uppercase tracking-[1px]">
                {item.label}
              </div>
              <div className={`w-6 h-[3px] ${accentColors[index]} mx-auto mt-2 rounded-full`} />
            </div>
          );
        })}
      </div>

      {/* Desktop: stats card matching mobile style */}
      <div className="hidden md:grid grid-cols-3 rounded-lg py-6 px-8 bg-surface-container-lowest animate-fade-in max-w-md mx-auto w-full">
        {items.map((item, index) => {
          const accentColors = ['bg-primary', 'bg-secondary', 'bg-muted-foreground/40'];
          return (
            <div
              key={index}
              className={`text-center px-4 ${index > 0 ? "border-l border-border" : ""}`}
            >
              <div className="text-4xl font-extrabold text-foreground tracking-[-1px] leading-none font-display">
                {formatNumber(item.value)}
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-semibold uppercase tracking-[1px]">
                {item.label}
              </div>
              <div className={`w-6 h-[3px] ${accentColors[index]} mx-auto mt-2.5 rounded-full`} />
            </div>
          );
        })}
      </div>
    </>
  );
};
