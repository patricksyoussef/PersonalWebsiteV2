/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "#FEFDFA",
        accent: "#2563eb",
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
