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
        className="md:hidden mx-6 mt-5 mb-6 rounded-lg py-5 px-2 grid grid-cols-3"
        style={{ backgroundColor: '#f1f5f9', animation: "heroFadeUp 0.55s ease 0.70s both" }}
      >
        {items.map((item, index) => {
          const colors = ['#00bf63', '#2144ff', '#f59e0b'];
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
              <div className="w-6 h-[3px] mx-auto mt-2 rounded-full" style={{ backgroundColor: colors[index] }} />
            </div>
          );
        })}
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
