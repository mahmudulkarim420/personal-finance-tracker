import type { Config } from "tailwindcss";
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
          "primary": "#b34800",      // Deep Orange/Brown for buttons
          "secondary": "#f4e0c8",    // Light beige
          "accent": "#6b3c1a",       // Dark cocoa brown
          "neutral": "#2b1a11",
          "base-100": "#fff1e2",     // Warm caramel background
          "base-200": "#f8e3cd",     // Card background
          "base-300": "#edd3b7",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "text-primary": "#2b1a11", // Brownish black text
        },
      },
    ],
    darkTheme: "caramellatte", // Dark mode off rakhar jonno force kora
  },
};

export default config;