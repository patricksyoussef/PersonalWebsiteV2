import { getCollection } from "astro:content";

export const isPublished = (entry) => entry.data.published === true;
export const isPinned = (entry) => entry.data.pinned === true;
export const filterDrafts = (entry) => {
  return import.meta.env.DEV || entry.data.draft !== true;
};

// General retrieve / filter for collections
export async function getFilteredEntries(collectionName, filters = []) {
  const entries = await getCollection(collectionName);
  return entries.filter((entry) => filters.every((filter) => filter(entry)));
}

// Assume we only want published entries
export async function getPublishedEntries(collectionName, pinned = false, dateSort = true) {
  const filters = [isPublished, filterDrafts, ...(pinned ? [isPinned] : [])];
  let entities = await getFilteredEntries(collectionName, filters);
  if (dateSort) {
    entities = sortEntries(entities);
  }
  return entities;
}

export function sortEntries(entries) {
  return entries.sort((a, b) => {
    return new Date(b.data.date) - new Date(a.data.date);
  });
}

export function parseKeyValuePairs(str) {
  const result = {};
  // Split by spaces: ["file=test.py", "output=2"]
  const pairs = str.split(" ");
  for (const pair of pairs) {
    // Split each pair by "="
    const [key, value] = pair.split("=");
    // Only store if both key and value exist
    if (key && value) {
      result[key] = value;
    }
  }
  return result;
}
