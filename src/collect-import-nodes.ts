import ts from 'typescript';

export function collectImportNodes(rootNode: ts.Node): ts.Node[] {
  const importNodes: ts.Node[] = [];
  const traverse = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      importNodes.push(node);
    }
  };
  rootNode.forEachChild(traverse);

  return importNodes;
}
