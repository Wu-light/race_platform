import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ary: {
          dark: "#06164A",
          blue: "#09266F",
          "blue-light": "#0A3FB8",
          accent: "#075BEC",
          "accent-light": "#168CFF",
          muted: "#53668D",
          surface: "#EAF3FF",
          "surface-dark": "#E2E8F0",
          card: "rgba(255,255,255,0.85)",
          "card-dark": "rgba(15,23,42,0.9)",
          canvas: "#EEF6FF",
          cyan: "#30D8FF",
          line: "rgba(34,107,230,0.22)",
          "line-strong": "rgba(24,92,218,0.42)",
          "blue-950": "#06164A",
          "blue-900": "#09266F",
          "blue-800": "#0A3FB8",
          "blue-700": "#075BEC",
          "blue-500": "#168CFF",
          "blue-100": "#EAF3FF",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        ary: "0 18px 44px rgba(11,57,150,0.16)",
      },
      keyframes: {
        "track-flow": {
          "0%": { transform: "translateX(-6%)" },
          "100%": { transform: "translateX(6%)" },
        },
        "marker-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.12)", opacity: "0.78" },
        },
      },
      animation: {
        "track-flow": "track-flow 8s ease-in-out infinite alternate",
        "marker-pulse": "marker-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
