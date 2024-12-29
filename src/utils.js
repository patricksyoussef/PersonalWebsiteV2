import { getCollection } from "astro:content";

export const isPublished = (entry) => entry.data.draft !== true;
export const isPinned = (entry) => entry.data.pinned === true;

// General retrieve / filter for collections
export async function getFilteredEntries(collectionName, filters = []) {
  const entries = await getCollection(collectionName);
  return entries.filter((entry) => filters.every((filter) => filter(entry)));
}

// Assume we only want published entries
export function getPublishedEntries(collectionName, pinned = false) {
  let filters = [isPublished, ...(pinned ? [isPinned] : [])];
  let entities = getFilteredEntries(collectionName, filters);
  return entities;
}
