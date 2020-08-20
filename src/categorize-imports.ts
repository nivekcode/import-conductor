import { ImportCategories } from './types';
import { isCustomImport } from './is-custom-import';
import { getConfig } from './config';
import { breakdownPath } from './helpers';

export function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
  const { thirdPartyDependencies } = getConfig();
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

    const isThirdParty = breakdownPath(normalized).some((subPath) => thirdPartyDependencies.has(subPath));

    if (isThirdParty) {
      thirdPartyImports.set(importLiteral, fullImportStatement);
    } else {
      differentModuleImports.set(importLiteral, fullImportStatement);
    }
  });

  return { thirdPartyImports, differentModuleImports, sameModuleImports, userLibraryImports };
}
