/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(37, 99, 235, 0.01)",
        accent: "rgba(37, 99, 235, 1.0)",
        darken: "rgba(0, 0, 0, 0.05)",
        edge: colors.gray[500],
      },
      fontFamily: {
        sans: ['"DM Sans Variable"', ...defaultTheme.fontFamily.sans],
        serif: ['"Petrona Variable"', ...defaultTheme.fontFamily.serif],
      },
      maxWidth: {
        base: "1500px",
        content: "1000px",
      },
      spacing: {
        common: "1rem",
      },
    },
  },
  plugins: [],
};
