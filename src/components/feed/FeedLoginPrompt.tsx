import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";

interface FeedLoginPromptProps {
  className?: string;
}

export const FeedLoginPrompt = ({ className }: FeedLoginPromptProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`w-full shadow-lg border-2 border-primary/20 ${className || ""}`}>
      <CardContent className="p-8 text-center space-y-6">
        <div className="text-2xl">🔓</div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Ready to see more?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Join our community to unlock all reviews, leave comments, and share
            your own taste tests!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() =>
                navigate("/auth", {
                  state: { from: "/feed" },
                })
              }
              className="border-0 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Log In
            </Button>
            <Button
              onClick={() =>
                navigate("/auth", {
                  state: { from: "/feed", mode: "signup" },
                })
              }
              variant="outline"
              size="lg"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
