export function mergeImportStatements(importStatementOne, importStatementTwo): string {
  const importedValues = importStatementTwo.match('{(.*)}')[1];
  return importStatementOne.replace('}', `,${importedValues}}`);
}
