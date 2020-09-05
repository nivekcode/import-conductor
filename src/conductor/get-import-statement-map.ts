import ts from 'typescript';

import { getConfig } from '../config';

import { mergeImportStatements } from './merge-import-statements';

export function getImportStatementMap(importNodes: ts.Node[]): Map<string, string> {
  const { autoMerge } = getConfig();
  const importStatementMap = new Map<string, string>();

  importNodes.forEach((node: ts.Node) => {
    const importSegments = node.getChildren();
    let importStatement = node.getFullText();
    if (importStatement.startsWith('\n')) {
      importStatement = importStatement.replace(/^\n*/, '');
    }
    const importLiteral = importSegments.find((segment) => segment.kind === ts.SyntaxKind.StringLiteral)?.getText();

    if (!importLiteral) {
      return;
    }

    const existingImport = importStatementMap.get(importLiteral);
    const canMerge = autoMerge && existingImport && [existingImport, importStatement].every((i) => !i.includes('*'));

    if (canMerge) {
      importStatementMap.set(importLiteral, mergeImportStatements(existingImport, importStatement));
    } else {
      const key = existingImport ? `${importLiteral}_${Math.random()}` : importLiteral;
      importStatementMap.set(key, importStatement);
    }
  });

  return importStatementMap;
}
