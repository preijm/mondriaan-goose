interface BackgroundPatternProps {
  children: React.ReactNode;
}

const BackgroundPattern = ({ children }: BackgroundPatternProps) => {
  return (
    <div
      className="min-h-screen w-full max-w-full relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 140% 80% at 50% -10%, rgba(0, 191, 99, 0.04) 0%, transparent 60%)'
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundPattern;
