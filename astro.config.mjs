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
  experimental: {
    svg: true,
    session: true,
  },
  adapter: netlify(),
});
