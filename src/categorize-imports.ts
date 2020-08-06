import { ImportCategories } from './types';
import { isCustomImport } from './is-custom-import';
import { getConfig } from './config';
import { breakdownPath } from './helper';

export function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
  const { thirdPartyDependencies } = getConfig();
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

    const normalized = importLiteral.replace(/['"]/g, '');
    const isThirdParty = breakdownPath(normalized).some((subPath) => thirdPartyDependencies.has(subPath));

    if (isThirdParty) {
      importCategories.thirdPartyImportPot.set(importLiteral, fullImportStatement);
    } else {
      importCategories.differentUserModulePot.set(importLiteral, fullImportStatement);
    }
  });

  return importCategories;
}
