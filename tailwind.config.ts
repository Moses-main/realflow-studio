/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Linear 2026 Dark Mode Palette
      colors: {
        background: '#0e1012', // App/canvas background
        surface: {
          DEFAULT: '#111315', // Surfaces/cards/nodes/sidebar
          elevated: '#141517', // Slight elevation for raised elements
        },
        primary: '#5e6ad2', // Desaturated blue-indigo (accent, buttons, active states)
        success: '#10b981', // Muted green
        warning: '#f59e0b', // Amber
        text: {
          primary: '#e5e7eb', // Primary text
          secondary: '#9ca3af', // Secondary/muted text
        },
        border: {
          DEFAULT: '#1e293b', // Borders/dividers/grid (very thin/subtle)
          muted: '#334155', // For even thinner dividers if needed
        },
        // Status indicators (keeping for completeness, but we'll use the accent for primary actions)
        status: {
          green: '#22c55e',
          orange: '#f97316',
          red: '#ef4444',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        // Inter font - 400, 500, 600 weights as specified
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px', // As specified
        md: '8px',
        sm: '6px',
      },
      spacing: {
        // Generous whitespace as specified
        section: '24px',
        'section-lg': '32px',
      },
      boxShadow: {
        // Subtle elevation only - no heavy shadows
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        DEFAULT: '200ms', // As specified for hover animations
      },
    },
  },
  plugins: [],
}