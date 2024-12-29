import { getCollection } from "astro:content";

export const isPublished = (entry) => entry.data.published === true;
export const isPinned = (entry) => entry.data.pinned === true;

// General retrieve / filter for collections
export async function getFilteredEntries(collectionName, filters = []) {
  const entries = await getCollection(collectionName);
  return entries.filter((entry) => filters.every((filter) => filter(entry)));
}

// Assume we only want published entries
export async function getPublishedEntries(
  collectionName,
  pinned = false,
  dateSort = true,
) {
  let filters = [isPublished, ...(pinned ? [isPinned] : [])];
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
