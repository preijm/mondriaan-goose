import React from "react";
import { Link } from "react-router-dom";
import { MapPin, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MapLoginOverlay = () => {
  return (
    <div className="relative min-h-[600px]">
      {/* Blurred map placeholder */}
      <div className="blur-sm pointer-events-none select-none">
        <div className="w-full h-[600px] rounded-lg border border-border bg-muted/30 flex items-center justify-center">
          <MapPin className="w-24 h-24 text-muted-foreground/30" />
        </div>
      </div>

      {/* Login CTA overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4">
          <div className="flex justify-center mb-4">
            <div className="text-4xl">🔓</div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Ready to see more?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our community to unlock the interactive world map showing milk
            tests from around the globe!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth?mode=signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
