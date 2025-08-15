
import React from "react";
import BackgroundPattern from "./BackgroundPattern";

interface BackgroundPatternWithOverlayProps {
  children: React.ReactNode;
}

const BackgroundPatternWithOverlay = ({ children }: BackgroundPatternWithOverlayProps) => {
  return (
    <BackgroundPattern>
      {children}
    </BackgroundPattern>
  );
};

export default BackgroundPatternWithOverlay;
