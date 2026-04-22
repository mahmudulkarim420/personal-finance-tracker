import type { Config } from "tailwindcss";
// @ts-ignore
import daisyui from "daisyui";

const config: Config & { daisyui?: any } = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        caramellatte: {
          "primary": "#b34800",
          "secondary": "#f4e0c8",
          "accent": "#6b3c1a",
          "neutral": "#2b1a11",
          "base-100": "#fff1e2",
          "base-200": "#f8e3cd",
          "base-300": "#edd3b7",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      {
        "obsidian-dark": {
          "primary": "#b34800",      // Consistency-r jonno primary orange-brown-i thakbe
          "secondary": "#111827",
          "accent": "#f4e0c8",
          "neutral": "#1f2937",
          "base-100": "#080808",     // Deep Premium Black
          "base-200": "#121212",     // Card background
          "base-300": "#1a1a1a",     // Border/Hover
          "base-content": "#e5e7eb", // Contrast text color
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
    // Default theme caramellatte thakbe, dark mode switch korle obsidian-dark hobe
    darkTheme: "obsidian-dark", 
  },
};

export default config;