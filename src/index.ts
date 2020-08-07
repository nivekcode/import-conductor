#!/usr/bin/env node

import commander from 'commander';
import gitChangedFiles from 'git-changed-files';

import * as packageJSON from '../package.json';

import { getFilesPaths } from './get-files-paths';
import { optimizeImports } from './optimize-imports';
import { setConfig } from './config';
import ora from 'ora';
import chalk from 'chalk';
import { getThirdParty } from './get-third-party';

const isEnabled = (bool) => bool !== 'false';
const collect = (value, previous) => previous.concat([value]);
commander
  .version(packageJSON.version)
  .option('--silent <boolean>', 'run with minimal log output')
  .option('-s --source <string>', 'path to the source files', './src/**/*.ts')
  .option('-p --userLibPrefixes <value>', 'the prefix of custom user libraries', collect, [])
  .option('--staged', 'run against staged files', false)
  .option('-d --autoAdd <boolean>', 'automatically adding the committed files when the staged option is used')
  .option('-m --autoMerge <boolean>', 'automatically merge 2 import statements from the same source')
  .parse(process.argv);

(async () => {
  const { silent, staged, source, userLibPrefixes, autoAdd, autoMerge } = commander;
  const thirdPartyDependencies = getThirdParty();
  setConfig({
    silent: isEnabled(silent),
    staged,
    source,
    userLibPrefixes,
    autoAdd: isEnabled(autoAdd),
    thirdPartyDependencies,
    autoMerge: isEnabled(autoMerge),
  });
  const files = staged ? (await gitChangedFiles({ showCommitted: false })).unCommittedFiles : await getFilesPaths(source);

  if (files.length === 0) {
    console.log(chalk.yellow(`⚠️ No matching files for regex: "${source}"`));
    return;
  }

  let spinner = silent ? ora('Conducting imports').start() : null;
  let importsReordered = 0;
  for await (const p of files) {
    importsReordered += await optimizeImports(p);
  }

  const msg = importsReordered === 0 ? 'No changes needed in all the files ✨' : `${importsReordered} file imports were reordered.`;
  spinner?.succeed(`Conducting imports - done!`);
  console.log(`🏁 Summary: ${msg}\n`);
})();
