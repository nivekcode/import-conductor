export interface ImportCategories {
  thirdPartyImports: Map<string, string>;
  userLibraryImports: Map<string, string>;
  differentModuleImports: Map<string, string>;
  sameModuleImports: Map<string, string>;
}

export interface Config {
  verbose: boolean;
  dryRun: boolean;
  staged: boolean;
  autoAdd: boolean;
  autoMerge: boolean;
  source: string;
  ignore: string[];
  userLibPrefixes: string[];
  thirdPartyDependencies?: Set<string>;
}

export type CliConfig = Omit<Config, 'autoAdd'> & { noAutoAdd: boolean };
