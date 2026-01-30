import { describe, it, expect } from "vitest";
import { getScoreBadgeVariant, getScoreVariant, getCircularScoreVariant } from "./scoreUtils";

describe("scoreUtils", () => {
  describe("getScoreBadgeVariant", () => {
    it("returns scoreBadgeExcellent for ratings >= 8.5", () => {
      expect(getScoreBadgeVariant(8.5)).toBe("scoreBadgeExcellent");
      expect(getScoreBadgeVariant(9)).toBe("scoreBadgeExcellent");
      expect(getScoreBadgeVariant(10)).toBe("scoreBadgeExcellent");
    });

    it("returns scoreBadgeGood for ratings >= 7.5 and < 8.5", () => {
      expect(getScoreBadgeVariant(7.5)).toBe("scoreBadgeGood");
      expect(getScoreBadgeVariant(8)).toBe("scoreBadgeGood");
      expect(getScoreBadgeVariant(8.4)).toBe("scoreBadgeGood");
    });

    it("returns scoreBadgeFair for ratings >= 5.5 and < 7.5", () => {
      expect(getScoreBadgeVariant(5.5)).toBe("scoreBadgeFair");
      expect(getScoreBadgeVariant(6)).toBe("scoreBadgeFair");
      expect(getScoreBadgeVariant(7.4)).toBe("scoreBadgeFair");
    });

    it("returns scoreBadgePoor for ratings < 5.5", () => {
      expect(getScoreBadgeVariant(0)).toBe("scoreBadgePoor");
      expect(getScoreBadgeVariant(3)).toBe("scoreBadgePoor");
      expect(getScoreBadgeVariant(5.4)).toBe("scoreBadgePoor");
    });
  });

  describe("getScoreVariant", () => {
    it("returns scoreExcellent for ratings >= 8.5", () => {
      expect(getScoreVariant(8.5)).toBe("scoreExcellent");
      expect(getScoreVariant(10)).toBe("scoreExcellent");
    });

    it("returns scoreGood for ratings >= 7.5 and < 8.5", () => {
      expect(getScoreVariant(7.5)).toBe("scoreGood");
      expect(getScoreVariant(8.4)).toBe("scoreGood");
    });

    it("returns scoreFair for ratings >= 5.5 and < 7.5", () => {
      expect(getScoreVariant(5.5)).toBe("scoreFair");
      expect(getScoreVariant(7.4)).toBe("scoreFair");
    });

    it("returns scorePoor for ratings < 5.5", () => {
      expect(getScoreVariant(0)).toBe("scorePoor");
      expect(getScoreVariant(5.4)).toBe("scorePoor");
    });
  });

  describe("getCircularScoreVariant", () => {
    it("returns circularScoreExcellent for ratings >= 8.5", () => {
      expect(getCircularScoreVariant(8.5)).toBe("circularScoreExcellent");
      expect(getCircularScoreVariant(10)).toBe("circularScoreExcellent");
    });

    it("returns circularScoreGood for ratings >= 7.5 and < 8.5", () => {
      expect(getCircularScoreVariant(7.5)).toBe("circularScoreGood");
      expect(getCircularScoreVariant(8.4)).toBe("circularScoreGood");
    });

    it("returns circularScoreFair for ratings >= 5.5 and < 7.5", () => {
      expect(getCircularScoreVariant(5.5)).toBe("circularScoreFair");
      expect(getCircularScoreVariant(7.4)).toBe("circularScoreFair");
    });

    it("returns circularScorePoor for ratings < 5.5", () => {
      expect(getCircularScoreVariant(0)).toBe("circularScorePoor");
      expect(getCircularScoreVariant(5.4)).toBe("circularScorePoor");
    });
  });
});
