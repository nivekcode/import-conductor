function breakdownPath(path: string): string[] {
  return path.split('/').map((_, i, arr) => arr.slice(0, i + 1).join('/'));
}

export function isThirdParty(libName: string) {
  return breakdownPath(libName).some((subPath) => {
    try {
      require.resolve(subPath);

      return true;
    } catch {
      return false;
    }
  });
}
