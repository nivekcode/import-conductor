import { Glob } from 'glob';
import * as util from 'util';

const glob = util.promisify(Glob);

export async function getFilePaths(regex: string): Promise<string[]> {
  return await glob(regex, {
    nodir: true,
  });
}
