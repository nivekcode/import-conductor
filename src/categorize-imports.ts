import { ImportCategories } from './types';
import { isCustomImport } from './is-custom-import';

export function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
  const importCategories: ImportCategories = {
    thirdPartyImportPot: new Map<string, string>(),
    userLibraryPot: new Map<string, string>(),
    differentUserModulePot: new Map<string, string>(),
    sameModulePot: new Map<string, string>(),
  };

  importLiterals.forEach((fullImportStatement: string, importLiteral: string) => {
    if (importLiteral.startsWith(`'./`)) {
      importCategories.sameModulePot.set(importLiteral, fullImportStatement);
      return;
    }

    if (importLiteral.startsWith(`'..`)) {
      importCategories.differentUserModulePot.set(importLiteral, fullImportStatement);
      return;
    }

    if (isCustomImport(importLiteral)) {
      importCategories.userLibraryPot.set(importLiteral, fullImportStatement);
      return;
    }

    importCategories.thirdPartyImportPot.set(importLiteral, fullImportStatement);
  });

  return importCategories;
}
