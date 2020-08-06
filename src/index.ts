import commander from 'commander';
import gitChangedFiles from 'git-changed-files';

import * as packageJSON from '../package.json';

import { getFilePaths } from './regex-helper';
import { optimizeImports } from './optimize-imports';

const collect = (value, previous) => previous.concat([value]);
commander
  .version(packageJSON.version)
  .option('-s --source <string>', 'path to the source files', './src/**/*.ts')
  .option('-p --userLibPrefixes <value>', 'the prefix of custom user libraries', collect, [])
  .option('--staged', 'run against staged files', false)
  .option('-d --disableAutoAdd', 'disable automatically adding the commited files when the staged option is used', false)
  .parse(process.argv);

(async () => {
  const files = commander.staged
    ? (await gitChangedFiles({ showCommitted: false })).unCommittedFiles
    : await getFilePaths(commander.source);
  for await (const p of files) {
    await optimizeImports(p);
  }
})();
