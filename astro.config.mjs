import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkReadingTime } from "./src/utils/remarkReadingTime.mjs";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      nesting: true,
    }),
    mdx(),
    preact(),
  ],
  markdown: {
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex],
  },
  devToolbar: {
    enabled: false,
  },
});
