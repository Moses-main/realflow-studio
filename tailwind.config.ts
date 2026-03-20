import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Linear-inspired dark mode colors
        app: {
          DEFAULT: "#0e1012",
          dark: "#0a0b0d",
        },
        surface: {
          DEFAULT: "#111315",
          elevated: "#141517",
          hover: "#1a1c1e",
          active: "#1f2124",
        },
        border: {
          DEFAULT: "#1e293b",
          subtle: "#1a1f2e",
          strong: "#334155",
        },
        // Text colors
        text: {
          primary: "#e5e7eb",
          secondary: "#9ca3af",
          muted: "#6b7280",
          disabled: "#4b5563",
        },
        // Primary accent (Linear's blue-indigo)
        primary: {
          DEFAULT: "#5e6ad2",
          hover: "#6b77c9",
          active: "#4f5bb8",
          muted: "rgba(94, 106, 210, 0.15)",
          foreground: "#ffffff",
        },
        // Status colors
        success: {
          DEFAULT: "#10b981",
          muted: "rgba(16, 185, 129, 0.15)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          muted: "rgba(245, 158, 11, 0.15)",
        },
        error: {
          DEFAULT: "#ef4444",
          muted: "rgba(239, 68, 68, 0.15)",
        },
        info: {
          DEFAULT: "#3b82f6",
          muted: "rgba(59, 130, 246, 0.15)",
        },
        // Sidebar
        sidebar: {
          bg: "#0e1012",
          border: "#1a1f2e",
          hover: "#141517",
        },
        // Canvas specific
        canvas: {
          bg: "#0a0b0d",
          dot: "#1a1c1e",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
        xl: "12px",
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        "xs": ["12px", { lineHeight: "16px" }],
        "sm": ["13px", { lineHeight: "20px" }],
        "base": ["14px", { lineHeight: "22px" }],
        "lg": ["16px", { lineHeight: "24px" }],
        "xl": ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.2s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
        "scale-in": "scale-in 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
