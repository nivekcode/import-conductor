import { getConfig } from '../config';
import { ImportCategories } from '../types';

type CategoryEntry = [string, Map<string, string>];

export function formatImportStatements(importCategories: ImportCategories, lineEnding: string) {
  const { separator } = getConfig();
  const [first, ...otherCategories] = Object.entries(importCategories)
    .filter(hasImports)
    .sort(byCategoriesOrder(getConfig().groupOrder))
    .map((imports) => toImportBlock(imports, lineEnding));

  let result = first || '';

  for (const imports of otherCategories) {
    result += `${separator}${lineEnding}${imports}`;
  }

  return result;
}

function byCategoriesOrder(categoriesOrder: string[]) {
  return ([a]: CategoryEntry, [b]: CategoryEntry): number => categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b);
}

function hasImports([, imports]: CategoryEntry) {
  return imports.size > 0;
}

function toImportBlock([, imports]: CategoryEntry, lineEnding: string) {
  return [...imports.values()].map((l) => trim(l, ` ${lineEnding}`)).join(lineEnding);
}

function escapeRegex(string: string) {
  return string.replace(/[\[\](){}?*+\^$\\.|\-]/g, '\\$&');
}

function trim(input: string, characters: string) {
  characters = escapeRegex(characters);

  return input.replace(new RegExp('^[' + characters + ']+|[' + characters + ']+$', 'g'), '');
}
