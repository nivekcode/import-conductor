import { getConfig } from '../config';

export function isCustomImport(literal: string): boolean {
  return getConfig().userLibPrefixes.some((prefix) => literal.startsWith(prefix));
}
