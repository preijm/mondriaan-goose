import React from "react";

interface FeedEmptyStateProps {
  isAuthenticated: boolean;
}

export const FeedEmptyState = ({ isAuthenticated }: FeedEmptyStateProps) => {
  if (isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No milk tests to show yet. Be the first to share your tasting!
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-lg">🥛✨</div>
        <h3 className="text-xl font-semibold text-foreground">
          The community is buzzing with amazing milk alternative discoveries!
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Members are sharing detailed reviews, uploading mouth-watering photos,
          rating products out of 10, and having lively discussions in the
          comments.
        </p>
        <p className="text-foreground font-medium">
          Join our community to see what everyone's raving about, discover your
          next favorite alternative, and share your own tastings!
        </p>
        <div className="text-lg">🚀</div>
        <p className="text-sm text-muted-foreground font-medium">
          Sign in now to unlock the full Moo'd Board experience
        </p>
      </div>
    </div>
  );
};
