import chalk from 'chalk';
import gitChangedFiles from 'git-changed-files';
import ora from 'ora';

import { resolveConfig, setConfig } from '../config';
import { log } from '../helpers/log';
import { Config } from '../types';

import { getFilesPaths } from './get-files-paths';
import { actions, optimizeImports } from './optimize-imports';

export async function conduct(cliConfig: Partial<Config>): Promise<string[]> {
  const config = resolveConfig(cliConfig);
  setConfig(config);
  const { staged, source, verbose, ignore, dryRun } = config;
  const filePaths = staged ? (await gitChangedFiles({ showCommitted: false })).unCommittedFiles : getFilesPaths(source);

  if (filePaths.length === 0) {
    const msg = staged ? 'No staged files found' : `No matching files for regex: "${source}"`;
    console.log(chalk.yellow(`⚠️ ${msg}`));
    return [];
  }

  dryRun && console.log('🧪 Dry run 🧪');
  let spinner = verbose ? null : ora('Conducting imports').start();
  const results = {
    [actions.skipped]: 0,
    [actions.reordered]: 0,
  };

  for await (const path of filePaths) {
    const ignoreFile = ignore.includes(path) || ignore.some((p) => path.includes(p));
    if (ignoreFile) {
      results[actions.skipped]++;
      log('gray', path, 'skipped (via ignore pattern)');
      continue;
    }

    const actionDone = await optimizeImports(path);
    if (actionDone in results) {
      results[actionDone]++;
    }
  }

  let messages = [];
  const reorderMessage =
    results.reordered === 0 ? '✨ No changes needed in all the files.' : `🔀 ${results.reordered} file imports were reordered.`;
  messages.push(reorderMessage);
  if (results.skipped > 0) {
    messages.push(`🦘 ${results.skipped} file${results.skipped > 1 ? 's were' : ' was'} skipped.`);
  }

  spinner?.succeed(`Conducting imports - done!`);

  return messages;
}
