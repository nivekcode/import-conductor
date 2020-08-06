import { Glob } from 'glob';
import * as util from 'util';

const glob = util.promisify(Glob);

export async function getFilePaths(regex: string): Promise<string[]> {
  const directoryFiles = await glob(regex, {
    nodir: true,
  });

  if (directoryFiles.length === 0) {
    console.log(`No matching files for regex: "${regex}"`);
    return;
  }

  return directoryFiles;
}
