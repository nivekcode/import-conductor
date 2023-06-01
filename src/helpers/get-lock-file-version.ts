export function getLockFileVersion(packageLockContent: any) {
  return packageLockContent?.lockfileVersion ?? -1;
}
