import { actions, optimizeImports } from '@ic/conductor/optimize-imports';
import * as config from '@ic/config';
import fs from 'fs';
import { Config } from '@ic/types';
import { readmeExample, comments, testCase } from './optimize-imports-mocks';

jest.mock('fs');

describe('optimizeImports', () => {
  const basicConfig: Config = {
    ignore: [],
    dryRun: false,
    verbose: false,
    staged: false,
    source: 'test.ts',
    userLibPrefixes: ['@myorg'],
    autoAdd: false,
    autoMerge: true,
    thirdPartyDependencies: new Set<string>(['@angular/core', 'rxjs']),
  };

  beforeEach(() => {
    spyOn(config, 'getConfig').and.returnValue(basicConfig);
    (fs.existsSync as any).mockReturnValue(true);
    (fs.writeFileSync as any).mockClear();
  });

  async function assertConductor({ expected, input }: testCase) {
    (fs.readFileSync as any).mockReturnValue(Buffer.from(input));
    const file = 'test.ts';
    const result = await optimizeImports(file);
    expect(fs.writeFileSync).toHaveBeenCalledWith(file, expected);

    return result;
  }

  it('should work with a basic example', async () => {
    await assertConductor(readmeExample);
  });

  it('should work with comments', async () => {
    await assertConductor(comments);
  });

  it('should skip the file when skip comment exists', async () => {
    const testCases = ['//import-conductor-skip', '// import-conductor-skip', '/* import-conductor-skip*/', '/*import-conductor-skip */'];
    for (const testCase of testCases) {
      (fs.readFileSync as any).mockReturnValue(Buffer.from(testCase));
      const file = 'test.ts';
      const result = await optimizeImports(file);
      expect(result).toBe(actions.skipped);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    }
  });
});
