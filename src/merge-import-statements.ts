export function mergeImportStatements(importStatementOne, importStatementTwo): string {
  const importedValues = importStatementTwo.replace(/\n\s*/g, '').match('{(.*)}')[1];
  return importStatementOne.replace('}', `,${importedValues}}`);
}
