

# Improving Product & Brand Naming Consistency

## What changes

### 1. Input normalization on save (trim + collapse spaces)
- Trim whitespace and collapse multiple spaces for both brand and product names before saving
- No automatic title-casing -- brand names are kept as the user types them

### 2. Case-insensitive duplicate prevention for brands
- The `addNewBrand` function in `useBrandData.ts` currently checks for duplicates using in-memory comparison, but the DB insert can still create duplicates if the local cache is stale
- Add an `ilike` check against the database before inserting (matching what `nameResolver.ts` already does for product names)

### 3. Fuzzy/close-match detection in suggestions
- When typing a brand or product name, detect near-matches (e.g., "Oatlly" vs "Oatly") using a simple similarity function
- Show close matches more prominently in the suggestion dropdown
- Only show "Add new" when no close match exists above a similarity threshold

### 4. "Did you mean...?" confirmation
- When the user clicks "Add new" and a similar (but not exact) entry exists, show a confirmation prompt before creating

---

## Technical Details

### New file: `src/lib/nameNormalization.ts`
- `normalizeName(name)` -- trims and collapses multiple spaces
- `isSimilar(a, b, threshold?)` -- simple similarity check (lowercase + stripped, basic edit distance or startsWith/includes logic)

### Modified files

**`src/hooks/useBrandData.ts`**
- Normalize input with `normalizeName()` before inserting
- Replace in-memory duplicate check with `ilike` DB query before insert
- Improve suggestion filtering to flag close matches using `isSimilar()`

**`src/components/milk-test/NameSelect.tsx`**
- Normalize input with `normalizeName()` before inserting
- Add close-match detection in suggestion filtering
- Only show "Add new" when no close match found

**`src/components/milk-test/hooks/product-registration/nameResolver.ts`**
- Apply `normalizeName()` before the existing `ilike` check

**`src/components/milk-test/BrandSuggestions.tsx`**
- Visually distinguish close matches (e.g., "Did you mean...?" label)
- Hide "Add new" when a close match exists

**`src/components/milk-test/ProductSelect.tsx`**
- Normalize product name input before inserting into the `names` table

### Flow

```text
User types brand/product name
        |
Show suggestions (substring + fuzzy match)
        |
User clicks "Add new"
        |
Normalize input (trim, collapse spaces)
        |
Check DB with ilike for exact match
   |
   Match found --> Reuse existing
   |
   No match, but similar entry exists --> Show "Did you mean...?" confirmation
   |
   No similar entry --> Insert new
```

