import { defineCollection } from "astro:content";

// Define our base schema that all blog posts will follow
function createBaseSchema({ image }) {
  return {
    title: String, // The post title
    slug: String, // The URL-friendly version of the title
    date: Date, // Publication date
    draft: {
      // Whether this is a draft post
      type: Boolean,
      default: false,
    },
    description: String, // A brief summary of the post
    tags: {
      // Categories or topics
      type: Array,
      default: [],
    },
  };
}

// Create the blog collection using our schema
const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) => ({
    ...createBaseSchema({ image }),
  }),
});

// Define a simple collection without type checking
const supplementsCollection = defineCollection({});

export const collections = {
  blog: blogCollection,
  supplements: supplementsCollection,
};
