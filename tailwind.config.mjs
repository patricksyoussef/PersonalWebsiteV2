import defaultTheme from "tailwindcss/defaultTheme";
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "#FCFBF9",
        accent: colors.blue[600],
        darken: "#F9F6F2",
        codeBackground: "#1e1e2e",
        edge: colors.stone[300],
        extralight: colors.stone[500],
        light: colors.stone[600],
      },
      fontFamily: {
        sans: ['"DM Sans Variable"', ...defaultTheme.fontFamily.sans],
        serif: ['"Petrona Variable"', ...defaultTheme.fontFamily.serif],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      maxWidth: {
        base: "1000px",
        content: "800px",
      },
      spacing: {
        common: "1rem",
        intra: "1rem",
        content: "0.75rem",
        cards: "0.75rem",
      },
      borderWidth: (theme) => ({
        content: theme("spacing.content"),
      }),
      borderRadius: (theme) => ({
        cards: theme("spacing.cards"),
        content: theme("spacing.content"),
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
