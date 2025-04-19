
import React from "react";
import BackgroundPattern from "./BackgroundPattern";

interface BackgroundPatternWithOverlayProps {
  children: React.ReactNode;
}

const BackgroundPatternWithOverlay = ({ children }: BackgroundPatternWithOverlayProps) => {
  return (
    <BackgroundPattern>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      {children}
    </BackgroundPattern>
  );
};

export default BackgroundPatternWithOverlay;
