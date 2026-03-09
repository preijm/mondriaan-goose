import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Score colors
        "score-excellent": "hsl(var(--score-excellent))",
        "score-good": "hsl(var(--score-good))",
        "score-fair": "hsl(var(--score-fair))",
        "score-poor": "hsl(var(--score-poor))",
        // Status colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        // Brand colors
        "brand-primary": {
          DEFAULT: "hsl(var(--brand-primary))",
          foreground: "hsl(var(--brand-primary-foreground))",
        },
        "brand-secondary": {
          DEFAULT: "hsl(var(--brand-secondary))",
          foreground: "hsl(var(--brand-secondary-foreground))",
        },
        "brand-tertiary": {
          DEFAULT: "hsl(var(--brand-tertiary))",
          foreground: "hsl(var(--brand-tertiary-foreground))",
        },
        // Heatmap colors
        "heatmap-very-high": "hsl(var(--heatmap-very-high))",
        "heatmap-high": "hsl(var(--heatmap-high))",
        "heatmap-medium-high": "hsl(var(--heatmap-medium-high))",
        "heatmap-medium": "hsl(var(--heatmap-medium))",
        "heatmap-low-medium": "hsl(var(--heatmap-low-medium))",
        "heatmap-low": "hsl(var(--heatmap-low))",
        "heatmap-none": "hsl(var(--heatmap-none))",
        // Surface colors
        "surface-warm": "hsl(var(--surface-warm))",
        "surface-cream": "hsl(var(--surface-cream))",
        // Legacy milk colors
        milk: {
          50: "#fdfcfb",
          100: "#f7f4f2",
          200: "#e8e4e1",
          300: "#d1ccc8",
          400: "#b3aba5",
          500: "#8c8580",
        },
        cream: {
          100: "#fff9f0",
          200: "#fff3e0",
          300: "#ffe0b2",
        },
        // Soft colors
        "soft-blue": "#D3E4FD",
        "soft-peach": "#FDE1D3",
        "soft-brown": "#F5E6D3",
        "soft-gray": "#E5E7EB",
        "soft-pink": "#FFDEE2",
        "soft-yellow": "#FEF7CD",
        "soft-green": "#F2FCE2",
        // Notification colors
        "notification-like": "hsl(var(--notification-like))",
        "notification-comment": "hsl(var(--notification-comment))",
        "notification-newsletter": "hsl(var(--notification-newsletter))",
        // Badge colors
        "badge-barista": {
          DEFAULT: "hsl(var(--badge-barista))",
          foreground: "hsl(var(--badge-barista-foreground))",
        },
        "badge-property": {
          DEFAULT: "hsl(var(--badge-property))",
          foreground: "hsl(var(--badge-property-foreground))",
        },
        "badge-flavor": {
          DEFAULT: "hsl(var(--badge-flavor))",
          foreground: "hsl(var(--badge-flavor-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        "heading-1": ["var(--font-size-5xl)", { lineHeight: "var(--line-height-tight)" }],
        "heading-2": ["var(--font-size-4xl)", { lineHeight: "var(--line-height-tight)" }],
        "heading-3": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-tight)" }],
        "heading-4": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-tight)" }],
        "heading-5": ["var(--font-size-xl)", { lineHeight: "var(--line-height-normal)" }],
        "heading-6": ["var(--font-size-lg)", { lineHeight: "var(--line-height-normal)" }],
        "body-lg": ["var(--font-size-lg)", { lineHeight: "var(--line-height-relaxed)" }],
        body: ["var(--font-size-base)", { lineHeight: "var(--line-height-normal)" }],
        "body-sm": ["var(--font-size-sm)", { lineHeight: "var(--line-height-normal)" }],
        "body-xs": ["var(--font-size-xs)", { lineHeight: "var(--line-height-normal)" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scroll: {
          "0%": { transform: "translateX(0%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "flip-up": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(-90deg) scale(1.1)" },
          "100%": { transform: "rotate(-180deg) scale(1)" },
        },
        "flip-down": {
          "0%": { transform: "rotate(-180deg) scale(1)" },
          "50%": { transform: "rotate(-90deg) scale(1.1)" },
          "100%": { transform: "rotate(0deg) scale(1)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        scroll: "scroll 8s linear infinite",
        "flip-up": "flip-up 0.3s ease-out forwards",
        "flip-down": "flip-down 0.3s ease-out forwards",
        "bounce-subtle": "bounce-subtle 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
