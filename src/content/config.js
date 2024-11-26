import { defineCollection } from "astro:content";

// Define a simple collection without type checking
const supplementsCollection = defineCollection({});

export const collections = {
  supplements: supplementsCollection,
};
