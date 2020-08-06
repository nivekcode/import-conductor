import commander from 'commander';
import gitChangedFiles from 'git-changed-files';

import * as packageJSON from '../package.json';

import { getFilePaths } from './regex-helper';
import { optimizeImports } from './optimize-imports';
import { setConfig } from './config';
import ora from 'ora';
import chalk from 'chalk';

const collect = (value, previous) => previous.concat([value]);
commander
  .version(packageJSON.version)
  .option('--silent <string>', 'run with minimal log output', false)
  .option('-s --source <string>', 'path to the source files', './src/**/*.ts')
  .option('-p --userLibPrefixes <value>', 'the prefix of custom user libraries', collect, [])
  .option('--staged', 'run against staged files', false)
  .option('-d --disableAutoAdd', 'disable automatically adding the commited files when the staged option is used', false)
  .parse(process.argv);

(async () => {
  const { silent, staged, source, userLibPrefixes, disableAutoAdd } = commander;
  setConfig({ silent, staged, source, userLibPrefixes, disableAutoAdd });
  const files = staged ? (await gitChangedFiles({ showCommitted: false })).unCommittedFiles : await getFilePaths(source);

  if (files.length === 0) {
    console.log(chalk.yellow(`⚠️ No matching files for regex: "${source}"`));
    return;
  }

  let spinner = silent ? ora('Conducting imports').start() : null;
  let importsReordered = 0;
  for await (const p of files) {
    importsReordered += await optimizeImports(p);
  }

  const msg =
    importsReordered === 0
      ? 'No change needed in all the files ✨'
      : `${importsReordered} file imports were reordered, no change need in ${files.length - importsReordered} files.`;
  spinner?.succeed(`Conducting imports - done!`);
  console.log(`🏁 Summary: ${msg}`);
})();
