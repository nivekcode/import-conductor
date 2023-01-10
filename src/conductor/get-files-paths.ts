import { sync } from 'fast-glob';

export function getFilesPaths(source: string[]): string[] {
  return source.map((pattern) => sync(pattern, { onlyFiles: true })).flat();
}
