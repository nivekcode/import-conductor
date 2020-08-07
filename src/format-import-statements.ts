import { ImportCategories } from './types';

export function formatImportStatements(importCategories: ImportCategories) {
  const { differentModuleImports, sameModuleImports, thirdPartyImports, userLibraryImports } = importCategories;
  let result = '';

  function updateResult(sortedPot: Map<string, string>, spaceBefore = true) {
    if (sortedPot.size > 0 && spaceBefore) {
      result += '\n\n';
    }
    [...sortedPot.values()].forEach(
      (fullImportLiteral: string, index: number) =>
        (result += index === sortedPot.size - 1 ? `${fullImportLiteral}` : `${fullImportLiteral}\n`)
    );
  }

  updateResult(thirdPartyImports, false);
  updateResult(userLibraryImports, thirdPartyImports.size > 0);
  updateResult(differentModuleImports, thirdPartyImports.size > 0 || userLibraryImports.size > 0);
  updateResult(sameModuleImports, thirdPartyImports.size > 0 || userLibraryImports.size > 0 || differentModuleImports.size > 0);

  return result;
}
