import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Base schema to be inherited for blog, projects, and musings
function createBaseSchema() {
  return z.object({
    title: z.string(), // The post title
    slug: z.string(), // The URL-friendly version of the title
    date: z.date(), // Publication date
    description: z.string().optional(), // A brief summary of the post
    tags: z.array(z.string()).default([]), // Array of strings, defaults to empty
    draft: z.boolean().default(false), // Defaults to false
    pinned: z.boolean().default(false), // Defaults to false
  });
}

// Create the blog collection using our schema
const blog = defineCollection({
  loader: glob({ pattern: ["**/*.md"], base: "./src/content/blog" }),
  schema: createBaseSchema(),
});

// Create the supplements collection using no schema
const supplements = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "./src/content/supplements" }),
});

export const collections = { blog, supplements };
