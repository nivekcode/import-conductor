export interface ImportCategories {
  [key: string]: Map<string, string>;
}

export interface Config {
  verbose: boolean;
  dryRun: boolean;
  staged: boolean;
  autoAdd: boolean;
  autoMerge: boolean;
  source: string;
  separator: string;
  ignore: string[];
  userLibPrefixes: string[];
  thirdPartyDependencies?: Set<string>;
}

export type CliConfig = Omit<Config, 'autoAdd'> & { noAutoAdd: boolean };
