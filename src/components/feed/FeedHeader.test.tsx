import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedHeader } from "./FeedHeader";

describe("FeedHeader", () => {
  const defaultProps = {
    username: "TestUser",
    createdAt: new Date().toISOString(),
    rating: 8.5,
  };

  it("renders username", () => {
    render(<FeedHeader {...defaultProps} />);
    expect(screen.getByText("TestUser")).toBeInTheDocument();
  });

  it("renders first letter avatar badge", () => {
    render(<FeedHeader {...defaultProps} />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("renders 'U' when username is undefined", () => {
    render(<FeedHeader createdAt={defaultProps.createdAt} rating={5} />);
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("renders formatted rating", () => {
    render(<FeedHeader {...defaultProps} />);
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("renders time ago text", () => {
    render(<FeedHeader {...defaultProps} />);
    // "less than a minute ago" or similar from date-fns
    expect(screen.getByText(/ago/i)).toBeInTheDocument();
  });

  it("applies blur class when blurred", () => {
    render(<FeedHeader {...defaultProps} blurred />);
    const username = screen.getByText("TestUser");
    expect(username.className).toContain("blur-sm");
  });

  it("does not apply blur class when not blurred", () => {
    render(<FeedHeader {...defaultProps} blurred={false} />);
    const username = screen.getByText("TestUser");
    expect(username.className).not.toContain("blur-sm");
  });
});
