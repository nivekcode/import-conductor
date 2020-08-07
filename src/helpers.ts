import fs from 'fs';

export function parseJsonFile(path) {
  return JSON.parse(fs.readFileSync(path).toString());
}

export function breakdownPath(path: string): string[] {
  return path.split('/').map((_, i, arr) => arr.slice(0, i + 1).join('/'));
}
