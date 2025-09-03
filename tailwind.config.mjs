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
        codeBackground: "#eff1f5",
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
        wide: "1200px",
        content: "800px",
      },
      spacing: {
        common: "1.25rem",
        intra: "1rem",
        content: "0.75rem",
        cards: "0.75rem",
      },
      borderWidth: (theme) => ({
        content: theme("spacing.content"),
      }),
      borderRadius: (theme) => ({
        cards: theme("spacing.cards"),
        content: "1rem",
      }),
      typography: ({ theme }) => {
        const defaultStyles = {
          color: theme("colors.neutral.950"),
          ":not(pre) > code::before": { content: "none" },
          ":not(pre) > code::after": { content: "none" },
          h1: { fontWeight: theme("fontWeight.bold") },
          h2: { fontWeight: theme("fontWeight.bold") },
          h3: { fontWeight: theme("fontWeight.semibold") },
          h4: { fontWeight: theme("fontWeight.semibold") },
          a: {
            textDecorationColor: "transparent",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            transitionProperty: "text-decoration-color",
            transitionDuration: "200ms",
          },
          ul: {
            listStylePosition: "outside",
          },
          "ul > li::marker": {
            color: theme("colors.stone.600"),
          },
          ol: {
            listStylePosition: "outside",
          },
          "ol > li::marker": {
            color: theme("colors.stone.600"),
          },
          li: {
            lineHeight: theme("lineHeight.8"),
            marginTop: "0.25em",
            marginBottom: "0.25em",
          },
          thead: {
            borderBottomColor: theme("colors.accent"),
          },
        };

        return {
          DEFAULT: {
            css: defaultStyles,
          },
          post: {
            css: {
              ...defaultStyles,
              a: {
                color: theme("colors.blue.700"),
                "&:hover": {
                  textDecorationColor: theme("colors.blue.700"),
                },
              },
            },
          },
        };
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
