export function mergeImportStatements(importStatementOne, importStatementTwo): string {
  let importedValues = importStatementTwo.replace(/\n\s*/g, '').match('{(.*)}')[1];
  const hasTrailingComma = /,\s*}/.test(importStatementOne);
  importedValues = hasTrailingComma ? `${importedValues},}` : `,${importedValues}}`;

  return importStatementOne.replace('}', importedValues);
}
