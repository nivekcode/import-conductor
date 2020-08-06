import ts from 'typescript';
import { collectImportStatement } from './collect-import-statements';
import { mergeImportStatements } from './merge-import-statements';

export function getImportStatementMap(importNodes: ts.Node[]): Map<string, string> {
  const importStatementMap = new Map<string, string>();

  importNodes.forEach((node: ts.Node) => {
    const importSegments = node.getChildren();
    const completeImportStatement = collectImportStatement(importSegments);
    const importLiteral = importSegments.find((segment) => segment.kind === ts.SyntaxKind.StringLiteral)?.getText();

    if (!importLiteral) {
      return;
    }

    const existingImport = importStatementMap.get(importLiteral);
    if (existingImport) {
      importStatementMap.set(importLiteral, mergeImportStatements(existingImport, completeImportStatement));
    } else {
      importStatementMap.set(importLiteral, completeImportStatement);
    }
  });

  return importStatementMap;
}
