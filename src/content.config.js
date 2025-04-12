import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function createBaseSchema(imageSchema = z.any().optional()) {
  return z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    excerpt: z.string().optional(),
    cover: imageSchema, // Using dynamic schema for image
    published: z.boolean().default(true),
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  });
}

// Create the blog collection using our schema
const blog = defineCollection({
  loader: glob({ pattern: ["**/index.mdx"], base: "./src/content/blog" }),
  schema: ({ image }) => createBaseSchema(image()),
});

// Create the projects collection using our schema
const projects = defineCollection({
  loader: glob({ pattern: ["**/index.mdx"], base: "./src/content/projects" }),
  schema: ({ image }) => createBaseSchema(image()),
});

// Create the musings collection using our schema
const musings = defineCollection({
  loader: glob({ pattern: ["**/index.mdx"], base: "./src/content/musings" }),
  schema: ({ image }) => createBaseSchema(image()),
});

// Create the supplements collection using no schema
const supplements = defineCollection({
  loader: glob({ pattern: ["**/*.mdx"], base: "./src/content/supplements" }),
});

export const collections = { blog, projects, musings, supplements };
