import fs from 'fs';

export function parseJsonFile(path) {
  return JSON.parse(fs.readFileSync(path).toString());
}
