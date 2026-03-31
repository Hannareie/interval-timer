import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          ink: "#07161D",
          panel: "#0F2430",
          panelSoft: "#183542",
          coral: "#32D2C5",
          coralBright: "#5BE7DA",
          pink: "#2FA7FF",
          work: "#42D392",
          rest: "#39B7FF",
          round: "#5D8BFF",
          warn: "#79E2C2",
        },
      },
      boxShadow: {
        glow: "0 18px 60px rgba(50, 210, 197, 0.34)",
        card: "0 18px 50px rgba(0, 0, 0, 0.28)",
      },
      backgroundImage: {
        hero: "linear-gradient(180deg, #7CEAD8 0%, #32D2C5 40%, #2FA7FF 100%)",
        glass:
          "linear-gradient(180deg, rgba(168, 52, 52, 0.12) 0%, rgba(255,255,255,0.04) 100%)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
