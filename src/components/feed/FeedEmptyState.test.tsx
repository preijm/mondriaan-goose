import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedEmptyState } from "./FeedEmptyState";

describe("FeedEmptyState", () => {
  it("shows authenticated message when user is logged in", () => {
    render(<FeedEmptyState isAuthenticated />);
    expect(screen.getByText(/Be the first to share your tasting/i)).toBeInTheDocument();
  });

  it("does not show unauthenticated CTA when logged in", () => {
    render(<FeedEmptyState isAuthenticated />);
    expect(screen.queryByText(/Sign in now/i)).not.toBeInTheDocument();
  });

  it("shows community pitch when not authenticated", () => {
    render(<FeedEmptyState isAuthenticated={false} />);
    expect(screen.getByText(/community is buzzing/i)).toBeInTheDocument();
  });

  it("shows sign-in CTA when not authenticated", () => {
    render(<FeedEmptyState isAuthenticated={false} />);
    expect(screen.getByText(/Sign in now/i)).toBeInTheDocument();
  });
});
