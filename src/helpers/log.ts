import chalk from 'chalk';

import { getConfig } from '../config';

export function log(color: string, file: string, message: string) {
  getConfig().verbose && console.log(chalk[color](`${file} - ${message}`));
}
