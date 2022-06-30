import { Config } from './types';

export const defaultConfig: Config = {
  source: ['./src/**/*.ts'],
  userLibPrefixes: [],
  separator: '\n',
  autoMerge: true,
  autoAdd: false,
  verbose: false,
  staged: false,
  dryRun: false,
  ignore: [],
  groupOrder: ['thirdParty', 'userLibrary', 'differentModule', 'sameModule'],
};
