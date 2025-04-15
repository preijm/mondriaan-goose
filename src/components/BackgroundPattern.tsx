
import React from "react";

interface BackgroundPatternProps {
  children: React.ReactNode;
}

const BackgroundPattern = ({ children }: BackgroundPatternProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80 relative overflow-hidden">
      {/* Large milk drops */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 3000 2000" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
          {/* Animated milk drops using teardrop shapes */}
          <g className="animate-[float_8s_ease-in-out_infinite]">
            <path d="M300 400 C300 300, 400 200, 500 400 C600 600, 200 600, 300 400" fill="url(#milk-gradient1)" />
          </g>
          <g className="animate-[float_12s_ease-in-out_infinite_1s]" style={{ transform: 'translate(600px, 200px)' }}>
            <path d="M300 400 C300 300, 400 200, 500 400 C600 600, 200 600, 300 400" fill="url(#milk-gradient2)" />
          </g>
          <g className="animate-[float_10s_ease-in-out_infinite_2s]" style={{ transform: 'translate(1200px, -100px)' }}>
            <path d="M300 400 C300 300, 400 200, 500 400 C600 600, 200 600, 300 400" fill="url(#milk-gradient1)" />
          </g>
          <g className="animate-[float_15s_ease-in-out_infinite_0.5s]" style={{ transform: 'translate(1800px, 300px)' }}>
            <path d="M300 400 C300 300, 400 200, 500 400 C600 600, 200 600, 300 400" fill="url(#milk-gradient2)" />
          </g>
          
          {/* Gradients definitions */}
          <defs>
            <linearGradient id="milk-gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="milk-gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 backdrop-blur-[1px]" />
      
      {/* Content */}
      {children}
    </div>
  );
};

export default BackgroundPattern;

