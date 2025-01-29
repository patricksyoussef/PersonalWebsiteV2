import defaultTheme from "tailwindcss/defaultTheme";
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(37, 99, 235, 0.01)",
        accent: "rgba(37, 99, 235, 1.0)",
        darken: "rgba(0, 0, 0, 0.03)",
        edge: colors.neutral[300],
        extralight: "oklch(0.632 0 0);",
        light: colors.neutral[600],
      },
      fontFamily: {
        sans: ['"DM Sans Variable"', ...defaultTheme.fontFamily.sans],
        serif: ['"Petrona Variable"', ...defaultTheme.fontFamily.serif],
      },
      maxWidth: {
        base: "1500px",
        content: "850px",
      },
      spacing: {
        common: "1rem",
        intra: "1rem",
        content: "0.4rem",
        cards: "0.75rem",
      },
      borderWidth: (theme) => ({
        content: theme("spacing.content"),
      }),
      borderRadius: (theme) => ({
        cards: theme("spacing.cards"),
        content: theme("spacing.content"),
      }),
      boxShadow: {
        "left-lg": "-10px 0 15px -3px rgba(0, 0, 0, 0.25)", // Large left shadow
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
