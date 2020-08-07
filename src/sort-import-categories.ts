import { ImportCategories } from './types';

export function sortImportCategories(importCategories: ImportCategories): ImportCategories {
  return Object.keys(importCategories).reduce((sorted, key) => {
    sorted[key] = new Map([...importCategories[key]].sort());

    return sorted;
  }, {}) as ImportCategories;
}
