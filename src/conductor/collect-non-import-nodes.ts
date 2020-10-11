import { isImportDeclaration, Node } from 'typescript';

export function collectNonImportNodes(rootNode: Node, lastImport: Node): Node[] {
  const nonImportNodes: Node[] = [];
  let importsEnded = false;
  const traverse = (node: Node) => {
    importsEnded = importsEnded || node === lastImport;
    if (!importsEnded) {
      if (!isImportDeclaration(node)) {
        nonImportNodes.push(node);
      }
    }
  };
  rootNode.forEachChild(traverse);

  return nonImportNodes;
}
