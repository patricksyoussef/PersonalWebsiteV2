/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        default: "#FEFDFA",
        accent: "#2E6F40",
      },
      fontFamily: {
        serif: ['"Petrona Variable"', ...defaultTheme.fontFamily.serif],
      },
      maxWidth: {
        base: "1500px",
      },
    },
  },
  plugins: [],
};
