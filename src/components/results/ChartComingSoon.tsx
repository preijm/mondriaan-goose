import React from "react";
import { ChartBar } from "lucide-react";

export const ChartComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <ChartBar className="w-16 h-16 text-muted-foreground/50" />
      <h2 className="text-3xl font-semibold text-foreground">Coming Soon</h2>
      <p className="text-muted-foreground max-w-md">
        We're working on bringing you insightful charts and analytics. Check
        back soon!
      </p>
    </div>
  );
};
