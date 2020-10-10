import { sync } from 'glob';

export function getFilesPaths(source: string[]): string[] {
  return source.map((pattern) => sync(pattern, { nodir: true })).flat();
}
