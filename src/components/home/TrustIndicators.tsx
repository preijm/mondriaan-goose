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
        className="md:hidden mx-6 mt-5 mb-6 rounded-2xl py-[18px] px-2 grid grid-cols-3"
        style={{ backgroundColor: '#f8fafc', animation: "heroFadeUp 0.55s ease 0.70s both" }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`text-center px-2 ${index > 0 ? "border-l border-[hsl(var(--outline-variant)/0.15)]" : ""}`}
          >
            <div className="text-[26px] font-bold text-foreground tracking-[-0.8px] leading-none font-display">
              {formatNumber(item.value)}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium uppercase tracking-[0.5px]">
              {item.label}
            </div>
            <div className={`w-[22px] h-[2.5px] ${item.colorClass} mx-auto mt-[7px] rounded-full`} />
          </div>
        ))}
      </div>

      {/* Desktop: inline dot list */}
      <div className="hidden md:flex items-center justify-center gap-4 md:gap-8 text-sm text-muted-foreground animate-fade-in">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.colorClass}`} />
            <span>
              {formatNumber(item.value)} {item.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};
