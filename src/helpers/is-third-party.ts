import { getConfig } from '../config';

function breakdownPath(path: string): string[] {
  return path.split('/').map((_, i, arr) => arr.slice(0, i + 1).join('/'));
}

export function isThirdParty(libName: string) {
  let isThirdPartyModule = false;
  const { thirdPartyDependencies, userLibPrefixes } = getConfig();

  try {
    isThirdPartyModule = require.resolve(libName).includes('node_modules');
  } catch {
    console.log();
    console.warn(`⚡ You are importing ${libName} but it is not installed.`);
    console.warn(`⚡ Trying to figure out import category based on library name: ${libName}`);
    isThirdPartyModule = !libName.startsWith('.') && !userLibPrefixes.some((prefix) => libName.startsWith(prefix));
  }
}
