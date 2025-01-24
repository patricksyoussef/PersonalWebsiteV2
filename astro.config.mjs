import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { astroExpressiveCode } from "astro-expressive-code";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({
    nesting: true,
  }), astroExpressiveCode({
    themes: ["light-plus"],
    styleOverrides: {
      // You can optionally override the plugin's default styles here
      frames: {
        editorBackground: "rgb(247, 247, 247)",
      },
    },
  }), mdx(), preact()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});