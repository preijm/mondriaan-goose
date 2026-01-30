import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateUsername,
  validateMilkTestInput,
  validateSearchInput,
  sanitizeForDatabase,
  ClientSideRateLimit,
} from "./security";

describe("security utilities", () => {
  describe("sanitizeInput", () => {
    it("removes script tags", () => {
      expect(sanitizeInput("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script");
    });

    it("removes HTML tags", () => {
      expect(sanitizeInput("<div>content</div>")).toBe("divcontent/div");
    });

    it("removes javascript: protocol", () => {
      expect(sanitizeInput("javascript:alert(1)")).toBe("alert(1)");
    });

    it("removes event handlers", () => {
      expect(sanitizeInput("onclick=\"alert(1)\"")).toBe("");
      expect(sanitizeInput("onload='alert(1)'")).toBe("");
    });

    it("trims whitespace", () => {
      expect(sanitizeInput("  hello world  ")).toBe("hello world");
    });

    it("returns empty string for non-string input", () => {
      expect(sanitizeInput(null as unknown as string)).toBe("");
      expect(sanitizeInput(undefined as unknown as string)).toBe("");
      expect(sanitizeInput(123 as unknown as string)).toBe("");
    });

    it("preserves safe content", () => {
      expect(sanitizeInput("Hello World!")).toBe("Hello World!");
      expect(sanitizeInput("Test 123 @#$%")).toBe("Test 123 @#$%");
    });
  });

  describe("validateEmail", () => {
    it("returns true for valid emails", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.org")).toBe(true);
      expect(validateEmail("user+tag@example.co.uk")).toBe(true);
    });

    it("returns false for invalid emails", () => {
      expect(validateEmail("notanemail")).toBe(false);
      expect(validateEmail("@nodomain")).toBe(false);
      expect(validateEmail("no@tld")).toBe(false);
      expect(validateEmail("spaces in@email.com")).toBe(false);
    });

    it("returns false for empty or null input", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail(null as unknown as string)).toBe(false);
      expect(validateEmail(undefined as unknown as string)).toBe(false);
    });

    it("returns false for emails exceeding RFC limit", () => {
      const longEmail = "a".repeat(250) + "@test.com";
      expect(validateEmail(longEmail)).toBe(false);
    });
  });

  describe("validatePassword", () => {
    describe("for login (not signup)", () => {
      it("returns valid for any non-empty password", () => {
        expect(validatePassword("pass", false)).toEqual({ isValid: true, message: "" });
        expect(validatePassword("123", false)).toEqual({ isValid: true, message: "" });
      });

      it("returns invalid for empty password", () => {
        expect(validatePassword("", false).isValid).toBe(false);
        expect(validatePassword(null as unknown as string, false).isValid).toBe(false);
      });
    });

    describe("for signup", () => {
      it("requires minimum 8 characters", () => {
        expect(validatePassword("Short1", true).isValid).toBe(false);
        expect(validatePassword("Short1", true).message).toContain("8 characters");
      });

      it("requires lowercase letter", () => {
        expect(validatePassword("UPPERCASE1", true).isValid).toBe(false);
        expect(validatePassword("UPPERCASE1", true).message).toContain("lowercase");
      });

      it("requires uppercase letter", () => {
        expect(validatePassword("lowercase1", true).isValid).toBe(false);
        expect(validatePassword("lowercase1", true).message).toContain("uppercase");
      });

      it("requires a number", () => {
        expect(validatePassword("NoNumbers", true).isValid).toBe(false);
        expect(validatePassword("NoNumbers", true).message).toContain("number");
      });

      it("accepts valid strong passwords", () => {
        expect(validatePassword("ValidPass1", true)).toEqual({ isValid: true, message: "" });
        expect(validatePassword("MySecure123", true)).toEqual({ isValid: true, message: "" });
      });

      it("rejects passwords that are too long", () => {
        const longPassword = "Aa1" + "x".repeat(130);
        expect(validatePassword(longPassword, true).isValid).toBe(false);
      });
    });
  });

  describe("validateUsername", () => {
    it("returns valid for proper usernames", () => {
      expect(validateUsername("john_doe")).toEqual({ isValid: true, message: "" });
      expect(validateUsername("user123")).toEqual({ isValid: true, message: "" });
    });

    it("rejects short usernames", () => {
      expect(validateUsername("a").isValid).toBe(false);
      expect(validateUsername("a").message).toContain("2 characters");
    });

    it("rejects long usernames", () => {
      const longUsername = "a".repeat(35);
      expect(validateUsername(longUsername).isValid).toBe(false);
      expect(validateUsername(longUsername).message).toContain("30 characters");
    });

    it("rejects empty username", () => {
      expect(validateUsername("").isValid).toBe(false);
      expect(validateUsername(null as unknown as string).isValid).toBe(false);
    });
  });

  describe("validateMilkTestInput", () => {
    it("accepts valid milk test input", () => {
      expect(validateMilkTestInput({ rating: 7.5 })).toEqual({ isValid: true, message: "" });
      expect(validateMilkTestInput({ 
        rating: 8, 
        notes: "Great taste", 
        shopName: "Store",
        countryCode: "NL"
      })).toEqual({ isValid: true, message: "" });
    });

    it("rejects invalid rating", () => {
      expect(validateMilkTestInput({ rating: -1 }).isValid).toBe(false);
      expect(validateMilkTestInput({ rating: 11 }).isValid).toBe(false);
      expect(validateMilkTestInput({ rating: "invalid" as unknown as number }).isValid).toBe(false);
    });

    it("rejects notes that are too long", () => {
      const longNotes = "x".repeat(1001);
      expect(validateMilkTestInput({ rating: 5, notes: longNotes }).isValid).toBe(false);
    });

    it("rejects shop name that is too long", () => {
      const longShopName = "x".repeat(256);
      expect(validateMilkTestInput({ rating: 5, shopName: longShopName }).isValid).toBe(false);
    });

    it("rejects invalid country codes", () => {
      expect(validateMilkTestInput({ rating: 5, countryCode: "USA" }).isValid).toBe(false);
      expect(validateMilkTestInput({ rating: 5, countryCode: "nl" }).isValid).toBe(false);
      expect(validateMilkTestInput({ rating: 5, countryCode: "1A" }).isValid).toBe(false);
    });
  });

  describe("validateSearchInput", () => {
    it("accepts valid search terms", () => {
      expect(validateSearchInput("oat milk")).toEqual({ isValid: true, message: "" });
      expect(validateSearchInput("a")).toEqual({ isValid: true, message: "" });
    });

    it("rejects empty search terms", () => {
      expect(validateSearchInput("").isValid).toBe(false);
      expect(validateSearchInput(null as unknown as string).isValid).toBe(false);
    });

    it("rejects search terms that are too long", () => {
      const longSearch = "x".repeat(101);
      expect(validateSearchInput(longSearch).isValid).toBe(false);
    });
  });

  describe("sanitizeForDatabase", () => {
    it("removes SQL keywords", () => {
      expect(sanitizeForDatabase("SELECT * FROM users")).not.toContain("SELECT");
      expect(sanitizeForDatabase("DROP TABLE users")).not.toContain("DROP");
    });

    it("removes semicolons", () => {
      expect(sanitizeForDatabase("data; DROP TABLE;")).not.toContain(";");
    });

    it("removes SQL comments", () => {
      expect(sanitizeForDatabase("data /* comment */")).not.toContain("/*");
      expect(sanitizeForDatabase("data /* comment */")).not.toContain("*/");
    });

    it("preserves safe content", () => {
      expect(sanitizeForDatabase("Oat milk from store")).toBe("Oat milk from store");
    });
  });

  describe("ClientSideRateLimit", () => {
    let rateLimit: ClientSideRateLimit;

    beforeEach(() => {
      rateLimit = new ClientSideRateLimit(3, 1000); // 3 attempts per second
    });

    it("allows attempts within limit", () => {
      expect(rateLimit.canAttempt("test")).toBe(true);
      rateLimit.recordAttempt("test");
      expect(rateLimit.canAttempt("test")).toBe(true);
      rateLimit.recordAttempt("test");
      expect(rateLimit.canAttempt("test")).toBe(true);
      rateLimit.recordAttempt("test");
    });

    it("blocks attempts after limit reached", () => {
      rateLimit.recordAttempt("test");
      rateLimit.recordAttempt("test");
      rateLimit.recordAttempt("test");
      expect(rateLimit.canAttempt("test")).toBe(false);
    });

    it("tracks different keys separately", () => {
      rateLimit.recordAttempt("key1");
      rateLimit.recordAttempt("key1");
      rateLimit.recordAttempt("key1");
      expect(rateLimit.canAttempt("key1")).toBe(false);
      expect(rateLimit.canAttempt("key2")).toBe(true);
    });

    it("returns remaining time for blocked keys", () => {
      rateLimit.recordAttempt("test");
      rateLimit.recordAttempt("test");
      rateLimit.recordAttempt("test");
      const remaining = rateLimit.getRemainingTime("test");
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(1000);
    });
  });
});
