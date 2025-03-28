import defaultTheme from "tailwindcss/defaultTheme";
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "#faf9f5",
        accent: "#3451DB",
        darken: "#F7F4F0",
        edge: colors.stone[300],
        extralight: colors.stone[500],
        light: colors.stone[600],
      },
      fontFamily: {
        sans: ['"DM Sans Variable"', ...defaultTheme.fontFamily.sans],
        serif: ['"Petrona Variable"', ...defaultTheme.fontFamily.serif],
      },
      maxWidth: {
        base: "1000px",
        content: "800px",
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
      aspectRatio: {
        card: "1.75",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
