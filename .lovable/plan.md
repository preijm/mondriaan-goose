

# Fix Like Button Spacing on Mobile

## Problem
On mobile, the heart icon and the like count number are too close together (gap-1.5 = 6px), making it hard to tap the correct element.

## Solution
Increase the gap between the heart icon and the like count on mobile, and add more horizontal padding to the button for a larger tap target.

## Technical Details

**File: `src/components/feed/FeedEngagement.tsx`**

- Change the like button's internal spacing from `gap-1.5` to `gap-2.5 sm:gap-1.5` -- giving more breathing room on mobile while keeping the compact look on desktop
- Increase horizontal padding from `px-2` to `px-3 sm:px-2` for a larger touch target on mobile

