export interface ImportCategories {
  thirdPartyImports: Map<string, string>;
  userLibraryImports: Map<string, string>;
  differentModuleImports: Map<string, string>;
  sameModuleImports: Map<string, string>;
}

export interface Config {
  silent: boolean;
  staged: boolean;
  autoAdd: boolean;
  autoMerge: boolean;
  source: string;
  userLibPrefixes: string[];
  thirdPartyDependencies: Set<string>;
}
