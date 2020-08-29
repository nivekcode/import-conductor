import { sync } from 'glob';

export function getFilesPaths(pattern: string): string[] {
  return sync(pattern, { nodir: true });
}
