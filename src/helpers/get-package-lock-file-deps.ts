import { getLockFileVersion } from './get-lock-file-version';

export function getPackageLockFileDeps(packageLockContent: any): string[] {
  const lockFileVersion = getLockFileVersion(packageLockContent);
  if (lockFileVersion < 3) {
    return Object.keys(packageLockContent.dependencies);
  }
  return Object.keys(packageLockContent.packages[''].dependencies);
}
