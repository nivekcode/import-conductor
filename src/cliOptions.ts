export const optionDefinitions = [
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    description: 'Run with detailed log output',
  },
  {
    name: 'source',
    alias: 's',
    type: String,
    defaultOptions: true,
    description: 'Path to the source files',
  },
  {
    name: 'userLibPrefixes',
    alias: 'p',
    type: String,
    multiple: true,
    description: 'The prefix of custom user libraries',
  },
  {
    name: 'staged',
    type: Boolean,
    description: 'Run against staged files',
  },
  {
    name: 'autoAdd',
    alias: 'a',
    type: Boolean,
    description: 'Automatically add the committed files when the staged option is used',
  },
  {
    name: 'noAutoMerge',
    type: Boolean,
    description: `Disable automatically merge 2 import statements from the same source`,
  },
  {
    name: 'ignore',
    alias: 'i',
    type: String,
    multiple: true,
    description: `Files to ignore`,
  },
  {
    name: 'dryRun',
    alias: 'd',
    type: Boolean,
    description: 'Run in dry run mode',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Help me, please!',
  },
  {
    name: 'version',
    type: Boolean,
    description: 'Get the import-conductor version',
  },
];

export const sections = [
  {
    header: 'Import conductor',
    content: 'Automatically organize your imports.',
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
];
