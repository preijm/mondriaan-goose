import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedProductInfo } from "./FeedProductInfo";

describe("FeedProductInfo", () => {
  it("renders brand and product name", () => {
    render(<FeedProductInfo brandName="Oatly" productName="Original" />);
    expect(screen.getByText("Oatly - Original")).toBeInTheDocument();
  });

  it("renders barista badge when isBarista is true", () => {
    render(<FeedProductInfo brandName="Oatly" productName="Barista" isBarista />);
    expect(screen.getByText("Barista")).toBeInTheDocument();
  });

  it("does not render barista badge when isBarista is false", () => {
    render(<FeedProductInfo brandName="Oatly" productName="Original" isBarista={false} />);
    expect(screen.queryByText("Barista")).not.toBeInTheDocument();
  });

  it("renders property badges (max 2)", () => {
    render(
      <FeedProductInfo
        brandName="Oatly"
        productName="Original"
        propertyNames={["oat", "organic", "sugar_free"]}
      />
    );
    expect(screen.getByText("oat")).toBeInTheDocument();
    expect(screen.getByText("organic")).toBeInTheDocument();
    expect(screen.queryByText("sugar free")).not.toBeInTheDocument();
  });

  it("replaces underscores with spaces in property names", () => {
    render(
      <FeedProductInfo
        brandName="Oatly"
        productName="Original"
        propertyNames={["sugar_free"]}
      />
    );
    expect(screen.getByText("sugar free")).toBeInTheDocument();
  });

  it("renders flavor badge (max 1)", () => {
    render(
      <FeedProductInfo
        brandName="Oatly"
        productName="Original"
        flavorNames={["vanilla", "chocolate"]}
      />
    );
    expect(screen.getByText("vanilla")).toBeInTheDocument();
    expect(screen.queryByText("chocolate")).not.toBeInTheDocument();
  });

  it("renders without optional props", () => {
    render(<FeedProductInfo brandName="Alpro" productName="Soy" />);
    expect(screen.getByText("Alpro - Soy")).toBeInTheDocument();
  });
});
