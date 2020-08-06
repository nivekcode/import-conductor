export interface ImportCategories {
  thirdPartyImportPot: Map<string, string>;
  userLibraryPot: Map<string, string>;
  differentUserModulePot: Map<string, string>;
  sameModulePot: Map<string, string>;
}

export interface Config {
  silent: boolean;
  staged: boolean;
  disableAutoAdd: boolean;
  source: string;
  userLibPrefixes: string[];
}
