# Design System Document: The Digital Greenhouse

## 1. Overview & Creative North Star

### Creative North Star: "Organic Editorial"
This design system rejects the clinical, rigid grids of traditional SaaS in favor of an "Organic Editorial" aesthetic. It is inspired by the "Digital Greenhouse"—a space that is breathable, light-filled, and intentionally nurturing. We achieve a premium feel by blending high-contrast typography scales with soft, fluid layouts that mimic natural growth rather than mechanical assembly.

To move beyond a "template" look, designers must embrace **Intentional Asymmetry**. Overlap organic shapes (like the background blobs in our reference) with structured text. Allow elements to breathe with generous white space, and treat every screen as if it were a high-end print magazine dedicated to sustainable living. We are building trust through sophistication, not through boxes and borders.

---

## 2. Colors

Our palette is rooted in the "Digital Greenhouse" concept: deep botanical greens, sky blues, and sun-drenched earth tones.

### The Palette
- **Primary & Earth Tones:** Use `primary` (#00bf63) for core brand moments and `tertiary` (#865400) for earthy accents that ground the playful greens.
- **Vibrancy:** `secondary` (#2144ff) serves as our high-energy "Action Blue." Use it sparingly for primary conversion points to provide a professional, energetic contrast to the organic greens.
- **Surface Neutrals:** `surface` (#f6faf7) is our "Fresh Air"—it is a tinted neutral that feels warmer and more organic than pure white.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts. For example, a card should be defined by placing a `surface-container-lowest` (#ffffff) element on top of a `surface-container-low` (#eff5f1) background. Lines feel like cages; tonal shifts feel like landscapes.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of frosted glass.
- **Level 0 (Base):** `surface`
- **Level 1 (Sections):** `surface-container-low`
- **Level 2 (Cards/Interaction):** `surface-container-lowest`
- **Level 3 (Pop-overs):** `surface-bright`

### The "Glass & Gradient" Rule
To add "soul," use subtle linear gradients for large hero areas or primary buttons, transitioning from `primary` (#006e37) to `primary_container` (#68fb99). For floating navigation or headers, apply a `backdrop-blur` with a semi-transparent `surface` color to mimic the glass of a greenhouse.

---

## 3. Typography

The typography strategy relies on the tension between the architectural `Epilogue` and the functional `Manrope`.

- **Character (Epilogue):** Use for `display` and `headline` tiers. It is friendly yet authoritative. Tighten letter-spacing (tracking) on `display-lg` to create a "locked-in" editorial look.
- **Legibility (Manrope):** Use for `body`, `title`, and `label` tiers. Its clean, open apertures ensure accessibility across all device sizes.
- **The Hierarchy Jump:** Don't be afraid of scale. Pairing a `display-lg` headline (3.5rem) directly with a `body-md` description (0.875rem) creates a premium, high-end editorial rhythm that feels intentional and curated.

---

## 4. Elevation & Depth

We achieve depth through **Tonal Layering** rather than traditional drop shadows.

- **The Layering Principle:** Stack `surface-container` tiers to create a soft, natural lift. A `surface-container-highest` container on a `surface` background provides enough contrast to imply depth without visual clutter.
- **Ambient Shadows:** If an element must float (e.g., a FAB or a modal), use an "Ambient Shadow." Shadows must be extra-diffused (Blur: 40px-60px) and low-opacity (4%-6%). Use a tinted version of `on-surface` (#2b3432) to ensure the shadow feels like a natural obstruction of light.
- **The "Ghost Border" Fallback:** If accessibility requires a border, use the "Ghost Border": the `outline-variant` token at 15% opacity. Never use 100% opaque borders.
- **Glassmorphism:** For overlays, use a semi-transparent `surface` color with a 20px backdrop blur. This allows the organic background shapes to bleed through, maintaining the "Greenhouse" transparency.

---

## 5. Components

### Buttons
- **Primary:** `secondary` (#0b45f2) background with `on-secondary` text. Use `rounded-md` for a clean, modern feel. Avoid overly rounded pill shapes.
- **Secondary:** `surface-container-lowest` background with a "Ghost Border."
- **Tertiary:** Pure text using `primary` color, with `spacing-2` (0.7rem) horizontal padding for hit-state affordance.

### Chips
- Use for categories like "Barista" or "Coconut." Use `primary-container` for the background and `on-primary-container` for text. Corner radius should be `rounded-lg` (0.75rem).

### Input Fields
- Avoid boxes. Use a `surface-container-high` background with a bottom-only `outline` (#737d79) at 20% opacity. This feels more "open" and less like a form to be "filled out."

### Cards & Lists
- **No Dividers:** Forbid the use of divider lines. Separate list items using `spacing-4` (1.4rem) of vertical white space or subtle alternating background shifts (`surface` to `surface-container-low`).
- **Organic Accents:** Incorporate a "Signature Detail" such as a small organic shape or a `tertiary-fixed` (#fea619) accent bar (see reference image stats) to draw the eye to key data.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `spacing-16` (5.5rem) and `spacing-20` (7rem) to create dramatic, editorial breaks between major sections.
- **Do** overlap typography over organic background "blobs" to create depth.
- **Do** use the `rounded-xl` (3rem) scale for large card containers to maintain the "soft" brand character.

### Don't:
- **Don't** use pure black (#000000). Always use `on-surface` (#2b3432) for text to maintain a natural, soft-contrast look.
- **Don't** use 90-degree corners. Everything in a greenhouse is organic; maintain at least a `rounded-sm` (0.5rem) radius even on the smallest elements.
- **Don't** align everything to a center axis. Use the editorial "Golden Ratio" to place elements off-center for a more bespoke feel.

### Accessibility Note:
Ensure that while we use soft colors, the `on-primary` and `on-secondary` tokens always maintain a 4.5:1 contrast ratio against their respective containers. Our "Digital Greenhouse" is for everyone.