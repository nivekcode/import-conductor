#!/usr/bin/env node
// import-conductor-skip
import './pollyfils';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import * as packageJSON from '../package.json';

import { optionDefinitions, sections } from './cliOptions';
import { conduct } from './conductor/conduct';
import chalk from 'chalk';

const cliConfig = commandLineArgs(optionDefinitions, {
  camelCase: true,
  stopAtFirstUnknown: true,
});
const { help, version } = cliConfig;

if (version) {
  console.log(packageJSON.version);
  process.exit();
}

if (help) {
  const usage = commandLineUsage(sections);
  console.log(usage);
  process.exit();
}

conduct(cliConfig).then((summary) => {
  if (summary.length) {
    const message = `${chalk.underline('🏁 Summary:')}\n${summary.join('\n')}\n`;
    console.log(message);
  }
});
