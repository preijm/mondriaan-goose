
import React from "react";

interface BackgroundPatternProps {
  children: React.ReactNode;
}

const BackgroundPattern = ({ children }: BackgroundPatternProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/90 via-blue-50/90 to-emerald-50/90 relative overflow-hidden">
      {/* Primary wave pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwMCIgaGVpZ2h0PSI4MDAiIHZpZXdCb3g9IjAgMCAzMDAwIDgwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTEwMDAgMjAwQy01MDAgNDAwIDAgMzAwIDUwMCA1MDBDMTA1MCA0MDAgMTUwMCA2MDAgMjAwMCA0MDBDMjUwMCA1MDAgMzAwMCAzMDAgMzUwMCA0MDAiIHN0cm9rZT0idXJsKCNncmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMEJGNjMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNkI2RDQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')] opacity-50 animate-[wave_15s_ease-in-out_infinite] will-change-transform" />
      
      {/* Secondary wave pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwMCIgaGVpZ2h0PSI4MDAiIHZpZXdCb3g9IjAgMCAzMDAwIDgwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTEwMDAgMzUwQy01MDAgNTUwIDAgNDUwIDUwMCA2NTBDMTA1MCA1NTAgMTUwMCA3NTAgMjAwMCA1NTBDMjUwMCA2NTAgMzAwMCA0NTAgMzUwMCA1NTAiIHN0cm9rZT0idXJsKCNncmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzNEQzOTkiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwRUI1QjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')] opacity-40 animate-[wave_20s_ease-in-out_infinite_reverse] will-change-transform scale-110" />

      {/* Additional wave pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwMCIgaGVpZ2h0PSI4MDAiIHZpZXdCb3g9IjAgMCAzMDAwIDgwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTEwMDAgMTAwQy01MDAgMzAwIDAgMjAwIDUwMCA0MDBDMTA1MCAzMDAgMTUwMCA1MDAgMjAwMCAzMDBDMjUwMCA0MDAgMzAwMCAyMDAgMzUwMCAzMDAiIHN0cm9rZT0idXJsKCNncmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMEJGNjMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNkI2RDQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')] opacity-30 animate-[wave_25s_ease-in-out_infinite] will-change-transform scale-125" />
      
      {/* Overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 backdrop-blur-[1px] animate-pulse" />
      
      {/* Content */}
      {children}
    </div>
  );
};

export default BackgroundPattern;
