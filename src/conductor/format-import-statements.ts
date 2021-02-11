import { getConfig } from '../config';
import { ImportCategories } from '../types';

type CategoryEntry = [string, Map<string, string>];

const categoriesOrder = ['thirdParty', 'userLibrary', 'differentModule', 'sameModule'];

export function formatImportStatements(importCategories: ImportCategories) {
  const { separator } = getConfig();
  const [first, ...otherCategories] = Object.entries(importCategories).filter(hasImports).sort(byCategoriesOrder).map(toImportBlock);

  let result = first || '';

  for (const imports of otherCategories) {
    result += `${separator}\n${imports}`;
  }

  return result;
}

function byCategoriesOrder([a]: CategoryEntry, [b]: CategoryEntry): number {
  return categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b);
}

function hasImports([, imports]: CategoryEntry) {
  return imports.size > 0;
}

function toImportBlock([, imports]: CategoryEntry) {
  return [...imports.values()].map((l) => trim(l, ' \n')).join('\n');
}

function escapeRegex(string: string) {
  return string.replace(/[\[\](){}?*+\^$\\.|\-]/g, '\\$&');
}

function trim(input: string, characters: string) {
  characters = escapeRegex(characters);

  return input.replace(new RegExp('^[' + characters + ']+|[' + characters + ']+$', 'g'), '');
}
