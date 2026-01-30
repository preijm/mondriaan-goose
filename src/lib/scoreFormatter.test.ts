import { describe, it, expect } from "vitest";
import { formatScore } from "./scoreFormatter";

describe("formatScore", () => {
  it("formats a whole number with one decimal place", () => {
    expect(formatScore(5)).toBe("5.0");
    expect(formatScore(10)).toBe("10.0");
    expect(formatScore(0)).toBe("0.0");
  });

  it("formats a decimal number with one decimal place", () => {
    expect(formatScore(7.5)).toBe("7.5");
    expect(formatScore(8.25)).toBe("8.3");
    expect(formatScore(3.14159)).toBe("3.1");
  });

  it("returns '0.0' for undefined input", () => {
    expect(formatScore(undefined)).toBe("0.0");
  });

  it("returns '0.0' for null input", () => {
    expect(formatScore(null)).toBe("0.0");
  });

  it("returns '0.0' for NaN input", () => {
    expect(formatScore(NaN)).toBe("0.0");
  });

  it("handles negative numbers", () => {
    expect(formatScore(-1)).toBe("-1.0");
    expect(formatScore(-2.5)).toBe("-2.5");
  });
});
