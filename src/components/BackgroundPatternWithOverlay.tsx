
import React from "react";
import BackgroundPattern from "./BackgroundPattern";

interface BackgroundPatternWithOverlayProps {
  children: React.ReactNode;
}

const BackgroundPatternWithOverlay = ({ children }: BackgroundPatternWithOverlayProps) => {
  return (
    <BackgroundPattern>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />
      {children}
    </BackgroundPattern>
  );
};

export default BackgroundPatternWithOverlay;
