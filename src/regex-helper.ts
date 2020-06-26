import * as util from 'util';
import { Glob } from 'glob';

const getFilesFromRegex = util.promisify(Glob);

export const getFilePathsFromRegex = async (regex: string): Promise<string[]> => {
  const directoryFiles = await getFilesFromRegex(regex, {
    nodir: true,
  });
  if (directoryFiles.length === 0) {
    console.log(`No matching files for regex: "${regex}"`);
    return;
  }
  return directoryFiles;
};
