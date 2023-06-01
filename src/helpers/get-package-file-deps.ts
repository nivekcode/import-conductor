export function getPackageFileDeps(packageContent: any): string[] {
  const { dependencies, devDependencies } = packageContent;
  return Object.keys(devDependencies).concat(Object.keys(dependencies));
}
