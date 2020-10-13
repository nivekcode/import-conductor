import { Node, isImportDeclaration } from 'typescript';

export function collectImportNodes(rootNode: Node): Node[] {
  const importNodes: Node[] = [];
  const traverse = (node: Node) => {
    if (isImportDeclaration(node)) {
      importNodes.push(node);
    }
  };
  rootNode.forEachChild(traverse);

  return importNodes;
}
