import { ImportCategories } from '../types';

const categoriesOrder = ['thirdPartyImports', 'userLibraryImports', 'differentModuleImports', 'sameModuleImports'];

export function formatImportStatements(importCategories: ImportCategories) {
  const [first, ...otherCategories] = Object.entries(importCategories)
    .filter(([, imports]) => imports.size > 0)
    .sort(([a], [b]) => categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b))
    .map(([, imports]) => imports);

  let result = first ? [...first.values()].join('\n') : '';

  for (const imports of otherCategories) {
    result += '\n\n' + [...imports.values()].join('\n');
  }

  return result;
}
