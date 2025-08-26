import { render } from "astro:content";

export const formatDate = (entry) => {
  return entry.data.date.toLocaleDateString("en-US", {
    timeZone: "UTC", // Forces the formatter to use UTC
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const joinTags = (entry) => {
  const tags = entry.data.tags;
  return tags.join(" · ");
};

export const readTime = async (entry) => {
  const { remarkPluginFrontmatter } = await render(entry);
  return remarkPluginFrontmatter.minutesRead;
};
