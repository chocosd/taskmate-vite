import type { Config } from "tailwindcss";

console.log("TAILWIND CONFIG LOADED ✅");

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
