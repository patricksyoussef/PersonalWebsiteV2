import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkReadingTime, remarkCodeBlocks, advanceHeadings, rehypeTrimInlineCode } from "./src/utils/remarkPlugins.js";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import preact from "@astrojs/preact";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://loquacious-snickerdoodle-c04dc5.netlify.app/",
  integrations: [
    tailwind({
      nesting: true,
    }),
    mdx(),
    preact(),
  ],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkMath, remarkReadingTime, remarkCodeBlocks, advanceHeadings],
    rehypePlugins: [rehypeKatex, rehypeTrimInlineCode],
  },
  devToolbar: {
    enabled: false,
  },
  adapter: netlify(),
});
