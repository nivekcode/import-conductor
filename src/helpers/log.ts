import chalk from 'chalk';

import { getConfig } from '../config';

export function log(color: string, message: string, file?: string) {
  getConfig().verbose && file ? console.log(chalk[color](`${file} - ${message}`)) : console.log(chalk[color](`${message}`));
}
