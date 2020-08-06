import { ImportCategories } from './types';

export function formatImportStatements(importCategories: ImportCategories) {
  const { differentUserModulePot, sameModulePot, thirdPartyImportPot, userLibraryPot } = importCategories;
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

  updateResult(thirdPartyImportPot, false);
  updateResult(userLibraryPot, thirdPartyImportPot.size > 0);
  updateResult(differentUserModulePot, thirdPartyImportPot.size > 0 || userLibraryPot.size > 0);
  updateResult(sameModulePot, thirdPartyImportPot.size > 0 || userLibraryPot.size > 0 || differentUserModulePot.size > 0);

  return result;
}
