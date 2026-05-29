import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark, #7C3AED)",
        },
        card: "var(--card-bg)",
        border: "var(--border-color)",
        uzala: {
          purple: "#8B5CF6",
          blue: "#3B82F6",
          teal: "#14B8A6",
          orange: "#F97316",
          cyan: "#06B6D4",
          dark: "#0F0F17",
          card: "#1A1A28",
          border: "#2A2A3C",
        },
      },
      borderRadius: {
        'xl': 'var(--radius)',
        '2xl': 'calc(var(--radius) * 1.5)',
        '3xl': 'calc(var(--radius) * 2)',
      },
      boxShadow: {
        'uzala': '0 4px 24px rgba(139, 92, 246, 0.15)',
        'uzala-lg': '0 8px 32px rgba(139, 92, 246, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
