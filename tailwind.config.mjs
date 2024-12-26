/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(37, 99, 235, 0.02)",
        accent: "rgba(37, 99, 235, 1.0)",
        edge: colors.gray[500],
      },
      fontFamily: {
        sans: ['"DM Sans Variable"', ...defaultTheme.fontFamily.serif],
      },
      maxWidth: {
        base: "1500px",
      },
      spacing: {
        common: "0.75rem",
      },
    },
  },
  plugins: [],
};
