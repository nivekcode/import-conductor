import { Config } from './types';

let config: Config;

export function getConfig(): Config {
  return config;
}

export function setConfig(cliConfig: Config) {
  config = cliConfig;
}
