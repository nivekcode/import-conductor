import { getLockFileVersion } from '@ic/helpers/get-lock-file-version';
import { getPackageLockFileDeps } from '@ic/helpers/get-package-lock-file-deps';

describe(`get package-lock.json file deps`, () => {
  it('should return deps with lockfileVersion < 3', () => {
    const packageLockFileContentVersion2 = JSON.parse(`{
      "name": "lockfile version 2",
      "version": "1.2.3",
      "lockfileVersion": 2,
      "dependencies": {
        "dep-a": "0.0.1",
        "dep-b": "^1.0.5"
      }
    }`);
    const expectedDeps = ['dep-a', 'dep-b'];
    expect(getLockFileVersion(packageLockFileContentVersion2)).toBe(2);
    expect(getPackageLockFileDeps(packageLockFileContentVersion2)).toEqual(expectedDeps);
  });

  it('should return deps with lockfileVersion = 3', () => {
    const packageLockFileContentVersion3 = JSON.parse(`{
      "name": "lockfile version 3",
      "version": "1.2.3",
      "lockfileVersion": 3,
      "packages": {
        "": {
          "dependencies": {
            "dep-a": "0.0.1",
            "dep-b": "^1.0.5"
          }
        }
      }
    }`);
    const expectedDeps = ['dep-a', 'dep-b'];
    expect(getLockFileVersion(packageLockFileContentVersion3)).toBe(3);
    expect(getPackageLockFileDeps(packageLockFileContentVersion3)).toEqual(expectedDeps);
  });
});
