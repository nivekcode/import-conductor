import { mergeImportStatements } from '../merge-import-statements';

describe('mergeImportStatements', () => {
  it('should merge two imports together', () => {
    const importStatementOne = "import {quux} from './quux/quux';";
    const importStatementTwo = "import {quox} from './quux/quux';";

    const expectedImportStatement = "import {quux,quox} from './quux/quux';";
    const actualImportStatement = mergeImportStatements(importStatementOne, importStatementTwo);

    expect(actualImportStatement).toBe(expectedImportStatement);
  });

  it('should merge two imports together (support multi line)', () => {
    const importStatementOne = "import {quux} from './quux/quux';";
    const importStatementTwo = `
    import {
      quox,
      quex
      } from './quux/quux';`;

    const expectedImportStatement = "import {quux,quox,quex} from './quux/quux';";
    const actualImportStatement = mergeImportStatements(importStatementOne, importStatementTwo);

    expect(actualImportStatement).toBe(expectedImportStatement);
  });
});
