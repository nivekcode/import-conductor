import { isCustomImport } from '../helpers/is-custom-import';
import { isThirdParty } from '../helpers/is-third-party';
import { ImportCategories } from '../types';

export function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
  const thirdParty = new Map<string, string>();
  const userLibrary = new Map<string, string>();
  const differentModule = new Map<string, string>();
  const sameModule = new Map<string, string>();

  importLiterals.forEach((fullImportStatement: string, importLiteral: string) => {
    const normalized = importLiteral.replace(/['"]/g, '');

    if (normalized.startsWith('./')) {
      sameModule.set(importLiteral, fullImportStatement);
      return;
    }

    if (normalized.startsWith('..')) {
      differentModule.set(importLiteral, fullImportStatement);
      return;
    }

    if (isCustomImport(normalized)) {
      userLibrary.set(importLiteral, fullImportStatement);
      return;
    }

    if (isThirdParty(normalized)) {
      thirdParty.set(importLiteral, fullImportStatement);
    } else {
      differentModule.set(importLiteral, fullImportStatement);
    }
  });

  return { thirdParty, differentModule, sameModule, userLibrary };
}
