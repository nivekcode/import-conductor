import { Config } from './types';

export const defaultConfig: Config = {
  source: './src/**/*.ts',
  userLibPrefixes: [],
  autoMerge: true,
  autoAdd: false,
  verbose: false,
  staged: false,
  dryRun: false,
  ignore: [],
};
