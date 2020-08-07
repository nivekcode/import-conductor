import { Glob } from 'glob';
import * as util from 'util';

const glob = util.promisify(Glob);

export async function getFilesPaths(regex: string): Promise<string[]> {
  return await glob(regex, {
    nodir: true,
  });
}
