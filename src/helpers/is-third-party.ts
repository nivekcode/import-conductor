import { getConfig } from '../config';

function breakdownPath(path: string): string[] {
  return path.split('/').map((_, i, arr) => arr.slice(0, i + 1).join('/'));
}

export function isThirdParty(libName: string) {
  let isCoreModule = false;
  try {
    isCoreModule = require.resolve(libName).indexOf('/') < 0;
  } catch {}

  const { thirdPartyDependencies } = getConfig();

  return isCoreModule || breakdownPath(libName).some((subPath) => thirdPartyDependencies.has(subPath));
}
