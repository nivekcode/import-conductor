import { defaultConfig } from '../defaultConfig';
import { Config } from '../types';

export function getGroupOrder(config: Partial<Config>) {
  const groups = new Set(config?.groupOrder || []);
  const uniqueGroups = Array.from(groups);
  return isValidGroupArgument(uniqueGroups) ? uniqueGroups : defaultConfig.groupOrder;
}

function isValidGroupArgument(groups: string[]): boolean {
  return groups.length === defaultConfig.groupOrder.length && groups.every((group) => defaultConfig.groupOrder.includes(group));
}
