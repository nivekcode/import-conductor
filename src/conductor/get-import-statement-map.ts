import ts from 'typescript';

import { getConfig } from '../config';

import { mergeImportStatements } from './merge-import-statements';

export function getImportStatementMap(importNodes: ts.Node[]): Map<string, string> {
  const { autoMerge } = getConfig();
  const importStatementMap = new Map<string, string>();

  importNodes.forEach((node: ts.Node) => {
    const importSegments = node.getChildren();
    let completeImportStatement = node.getFullText();
    if (completeImportStatement.startsWith('\n')) {
      completeImportStatement = completeImportStatement.replace('\n', '');
    }
    const importLiteral = importSegments.find((segment) => segment.kind === ts.SyntaxKind.StringLiteral)?.getText();

    if (!importLiteral) {
      return;
    }

    const existingImport = importStatementMap.get(importLiteral);
    const canMerge = autoMerge && existingImport && [existingImport, completeImportStatement].every((i) => !i.includes('*'));

    if (canMerge) {
      importStatementMap.set(importLiteral, mergeImportStatements(existingImport, completeImportStatement));
    } else {
      const key = existingImport ? `${importLiteral}_${Math.random()}` : importLiteral;
      importStatementMap.set(key, completeImportStatement);
    }
  });

  return importStatementMap;
}
