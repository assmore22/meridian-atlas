import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { vellum: "#EFEADC", paper: "#F7F3E8", ink: "#1A1F23", slate: "#5C6670", meridian: "#1F6FEB", confirm: "#2BB673", refute: "#E0533B", pending: "#E0A13B" },
      fontFamily: { head: ["var(--font-spacegrotesk)", "system-ui", "sans-serif"], body: ["var(--font-inter)", "system-ui", "sans-serif"], mono: ["var(--font-jbm)", "ui-monospace", "monospace"] },
      maxWidth: { reading: "720px", app: "1120px", wide: "1440px" },
      fontSize: { "fluid-page": "clamp(2rem,4.5vw,4rem)", "fluid-section": "clamp(1.5rem,3vw,2.6rem)", "fluid-panel": "clamp(1.05rem,1.6vw,1.4rem)" },
    },
  },
  plugins: [],
};
export default config;
