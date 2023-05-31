import { getPackageFileDeps } from '@ic/helpers/get-package-file-deps';

describe(`get package.json file deps`, () => {
  const packageFileContent = {
    name: 'name',
    version: '1.2.3',
    dependencies: {
      'dep-a': '0.0.1',
      'dep-b': '^1.0.5',
    },
    devDependencies: {
      '@dev/dep-a': '~2.0.0',
      '@dev/dep-b': '8.1.0',
    },
  };

  it('should return deps and devDeps', () => {
    const expectedDeps = ['@dev/dep-a', '@dev/dep-b', 'dep-a', 'dep-b'];
    expect(getPackageFileDeps(packageFileContent)).toEqual(expectedDeps);
  });
});
