import commander from 'commander';

export function isCustomImport(literal: string): boolean {
  return commander.userLibPrefixes.some((prefix) => literal.startsWith(prefix));
}
