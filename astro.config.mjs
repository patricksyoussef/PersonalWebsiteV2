import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

import astroExpressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      nesting: true,
    }),
    astroExpressiveCode({
      themes: ["catppuccin-mocha"],
    }),
    mdx(),
  ],
});
