import { getConfig } from '../config';

function breakdownPath(path: string): string[] {
  return path.split('/').map((_, i, arr) => arr.slice(0, i + 1).join('/'));
}

export function isThirdParty(libName: string) {
  const { thirdPartyDependencies } = getConfig();

  return breakdownPath(libName).some((subPath) => {
    if (thirdPartyDependencies.has(subPath)) {
      return true;
    }

    try {
      require.resolve(subPath);

      return true;
    } catch {
      return false;
    }
  });
}
