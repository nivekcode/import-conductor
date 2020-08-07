import { ImportCategories } from './types';
import { isCustomImport } from './is-custom-import';
import { getConfig } from './config';
import { breakdownPath } from './helper';

export function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
  const { thirdPartyDependencies } = getConfig();
  const thirdPartyImports = new Map<string, string>();
  const userLibraryImports = new Map<string, string>();
  const differentModuleImports = new Map<string, string>();
  const sameModuleImports = new Map<string, string>();

  importLiterals.forEach((fullImportStatement: string, importLiteral: string) => {
    if (importLiteral.startsWith(`'./`)) {
      sameModuleImports.set(importLiteral, fullImportStatement);
      return;
    }

    if (importLiteral.startsWith(`'..`)) {
      differentModuleImports.set(importLiteral, fullImportStatement);
      return;
    }

    if (isCustomImport(importLiteral)) {
      userLibraryImports.set(importLiteral, fullImportStatement);
      return;
    }

    const normalized = importLiteral.replace(/['"]/g, '');
    const isThirdParty = breakdownPath(normalized).some((subPath) => thirdPartyDependencies.has(subPath));

    if (isThirdParty) {
      thirdPartyImports.set(importLiteral, fullImportStatement);
    } else {
      differentModuleImports.set(importLiteral, fullImportStatement);
    }
  });

  return { thirdPartyImports, differentModuleImports, sameModuleImports, userLibraryImports };
}
