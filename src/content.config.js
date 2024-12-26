import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders"; // Not available with legacy API

function createBaseSchema() {
  return z.object({
    title: z.string(), // The post title
    slug: z.string(), // The URL-friendly version of the title
    date: z.date(), // Publication date
    draft: z.boolean().default(false), // Defaults to false
    description: z.string().optional(), // A brief summary of the post
    tags: z.array(z.string()).default([]), // Array of strings, defaults to empty
  });
}

// Create the blog collection using our schema
const blog = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "./src/content/blog" }),
  schema: createBaseSchema(),
});

// Define a simple collection without type checking
const supplements = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "./src/content/supplements" }),
});

export const collections = { blog, supplements };
