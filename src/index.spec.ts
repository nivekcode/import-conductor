import { mergeImportStatements } from './import.service';

describe('Importsservice', () => {
  it('should merge two imports together', () => {
    const importStatementOne = "import {quux} from './quux/quux';";
    const importStatementTwo = "import {quox} from './quux/quux';";

    const expectedImportStatement = "import {quux,quox} from './quux/quux';";
    const actualImportStatement = mergeImportStatements(importStatementOne, importStatementTwo);

    expect(actualImportStatement).toBe(expectedImportStatement);
  });
});
