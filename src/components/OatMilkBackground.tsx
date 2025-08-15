import React from "react";

interface OatMilkBackgroundProps {
  children: React.ReactNode;
}

const OatMilkBackground = ({ children }: OatMilkBackgroundProps) => {
  return (
    <div className="min-h-screen w-full max-w-full relative overflow-hidden oat-milk">
      {/* Oat grains pattern */}
      <div className="oat-grains" />
      
      {/* Milk splash with animation */}
      <div className="milk-splash" />
      
      {/* Plant stem */}
      <div className="plant-stem" />

      {/* Content */}
      {children}

    </div>
  );
};

export default OatMilkBackground;