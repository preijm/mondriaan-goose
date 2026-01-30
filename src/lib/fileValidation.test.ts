import { describe, it, expect } from "vitest";
import { sanitizeFileName } from "./fileValidation";

describe("fileValidation", () => {
  describe("sanitizeFileName", () => {
    it("converts to lowercase", () => {
      expect(sanitizeFileName("MyFile.PNG")).toBe("myfile.png");
    });

    it("replaces spaces with underscores", () => {
      expect(sanitizeFileName("my file name.jpg")).toBe("my_file_name.jpg");
    });

    it("replaces special characters with underscores", () => {
      expect(sanitizeFileName("file@#$%.jpg")).toBe("file_.jpg");
    });

    it("removes multiple consecutive underscores", () => {
      expect(sanitizeFileName("file___name.jpg")).toBe("file_name.jpg");
    });

    it("removes leading underscores", () => {
      expect(sanitizeFileName("_file_name.jpg")).toBe("file_name.jpg");
    });

    it("preserves dots and hyphens", () => {
      expect(sanitizeFileName("my-file.test.jpg")).toBe("my-file.test.jpg");
    });

    it("handles empty string", () => {
      expect(sanitizeFileName("")).toBe("");
    });

    it("handles unicode characters by removing them", () => {
      expect(sanitizeFileName("filéñäme.jpg")).toBe("fil_me.jpg");
    });

    it("handles complex filenames", () => {
      expect(sanitizeFileName("My Complex (File) [2024].jpg")).toBe("my_complex_file_2024_.jpg");
    });
  });
});
