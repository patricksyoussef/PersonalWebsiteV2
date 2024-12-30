import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { astroExpressiveCode } from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      nesting: true,
    }),
    astroExpressiveCode({
      themes: ["light-plus"],
      styleOverrides: {
        // You can optionally override the plugin's default styles here
        frames: {
          editorBackground: "rgb(247, 247, 247)",
        },
      },
    }),
    mdx(),
  ],
});
