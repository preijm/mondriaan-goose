
# Code Quality Cleanup Plan

This plan addresses unused variables, redundant conditions, and dead code flagged by CodeQL in GitHub security scans.

## Overview

After analyzing the codebase, I've identified several categories of code quality issues that trigger GitHub security warnings:

1. **Unused imports** - Imported functions/types that are never used
2. **Redundant conditions** - Conditions that are always true/false or can be simplified
3. **Unused local variables** - Variables declared but never read
4. **Redundant type checks** - Type guards on parameters that are already typed

---

## Issues to Fix

### 1. Unused Import in SearchBar.tsx
**File:** `src/components/milk-test/SearchBar.tsx`

**Issue:** `validateSearchInput` is imported but never used in the component.

**Fix:** Remove the unused import.

```tsx
// Before
import { validateSearchInput, sanitizeInput } from "@/lib/security";

// After
import { sanitizeInput } from "@/lib/security";
```

---

### 2. Redundant Condition in typography.tsx
**File:** `src/components/ui/typography.tsx`

**Issue:** The condition `fluid && fluid !== "none"` is checked twice on consecutive lines (48-49). This is redundant since both lines perform the same check.

**Fix:** Combine the logic into a single conditional assignment or use a helper variable.

```tsx
// Before (lines 48-49)
const levelClass = fluid && fluid !== "none" ? "" : headingVariants({ level: level || as, fluid: "none" })
const fluidClass = fluid && fluid !== "none" ? headingVariants({ fluid }) : ""

// After - use a single check
const isFluid = fluid && fluid !== "none";
const levelClass = isFluid ? "" : headingVariants({ level: level || as, fluid: "none" });
const fluidClass = isFluid ? headingVariants({ fluid }) : "";
```

---

### 3. Unused Imports in BarcodeScanner.tsx
**File:** `src/components/milk-test/BarcodeScanner.tsx`

**Issue:** `Camera` and `Upload` icons are imported from lucide-react but the `BarcodeScanner` component doesn't use them - they're only used by the `PictureCapture` component which is also exported from this file.

**Fix:** No change needed - these are used by the PictureCapture component in the same file. This is a false positive.

---

### 4. Unused Variable in useEditMilkTest.ts
**File:** `src/hooks/useEditMilkTest.ts`

**Issue:** Line 114 queries for `shopData` but it's never used anywhere in the code. The shop name is stored directly without needing the shop ID lookup.

**Fix:** Remove the unused query.

```tsx
// Before (lines 114-118)
const { data: shopData } = await supabase
  .from('shops')
  .select('id')
  .eq('name', shop)
  .maybeSingle();

// After - Remove these lines entirely
```

---

### 5. Redundant Type Check in security.ts
**File:** `src/lib/security.ts`

**Issue:** The functions `sanitizeInput`, `validateEmail`, `validatePassword`, `validateUsername`, `validateSearchInput`, and `sanitizeForDatabase` all check `typeof input !== 'string'`, but TypeScript already enforces the string type at compile time. While this is defensive programming for runtime safety, CodeQL may flag it as redundant.

**Recommendation:** Keep these checks for runtime safety (defense in depth) but add comments explaining why they exist for clarity. No code change needed.

---

### 6. Unused ESLint Rule Override
**File:** `eslint.config.js`

**Issue:** The rule `"@typescript-eslint/no-unused-vars": "off"` disables all unused variable warnings, which masks issues that CodeQL will catch anyway.

**Recommendation:** Consider enabling this rule to catch issues earlier, or keep it off since CodeQL provides coverage. No immediate change needed for this cleanup.

---

## Implementation Summary

| File | Issue | Action |
|------|-------|--------|
| `src/components/milk-test/SearchBar.tsx` | Unused import | Remove `validateSearchInput` |
| `src/components/ui/typography.tsx` | Redundant condition | Extract to `isFluid` variable |
| `src/hooks/useEditMilkTest.ts` | Unused variable | Remove `shopData` query |

---

## Technical Details

### Changes by File

**1. `src/components/milk-test/SearchBar.tsx`**
- Line 4: Remove `validateSearchInput` from import

**2. `src/components/ui/typography.tsx`**
- Lines 48-49: Replace redundant conditions with single `isFluid` check

**3. `src/hooks/useEditMilkTest.ts`**
- Lines 114-118: Remove unused `shopData` query

---

## Testing Considerations

After implementing these changes:
- The app should build without TypeScript errors
- All existing functionality remains unchanged (these are purely cleanup changes)
- Re-run CodeQL analysis to verify the warnings are resolved
