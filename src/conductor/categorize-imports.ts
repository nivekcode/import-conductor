import { isCustomImport } from '../helpers/is-custom-import';
import { isThirdParty } from '../helpers/is-third-party';
import { ImportCategories } from '../types';

export function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
  const thirdPartyImports = new Map<string, string>();
  const userLibraryImports = new Map<string, string>();
  const differentModuleImports = new Map<string, string>();
  const sameModuleImports = new Map<string, string>();

  importLiterals.forEach((fullImportStatement: string, importLiteral: string) => {
    const normalized = importLiteral.replace(/['"]/g, '');

    if (normalized.startsWith('./')) {
      sameModuleImports.set(importLiteral, fullImportStatement);
      return;
    }

    if (normalized.startsWith('..')) {
      differentModuleImports.set(importLiteral, fullImportStatement);
      return;
    }

    if (isCustomImport(normalized)) {
      userLibraryImports.set(importLiteral, fullImportStatement);
      return;
    }

    if (isThirdParty(normalized)) {
      thirdPartyImports.set(importLiteral, fullImportStatement);
    } else {
      differentModuleImports.set(importLiteral, fullImportStatement);
    }
  });

  return { thirdPartyImports, differentModuleImports, sameModuleImports, userLibraryImports };
}
