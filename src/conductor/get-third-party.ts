import fs from 'fs';
import pkgUp from 'pkg-up';

import { getPackageFileDeps } from '../helpers/get-package-file-deps';
import { getPackageLockFileDeps } from '../helpers/get-package-lock-file-deps';
import { parseJsonFile } from '../helpers/parse-json-file';

export function getThirdParty(): Set<string> {
  const packagePath = pkgUp.sync();
  const lockPath = packagePath.replace('package.json', 'package-lock.json');
  let deps: string[];

  if (fs.existsSync(lockPath)) {
    deps = getPackageLockFileDeps(parseJsonFile(lockPath));
  } else {
    deps = getPackageFileDeps(parseJsonFile(packagePath));
  }

  return new Set(deps);
}
