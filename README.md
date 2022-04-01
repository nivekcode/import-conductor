![Logo](https://raw.githubusercontent.com/kreuzerk/import-conductor/master/assets/logo.png)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# import-conductor

> Automatically organize your TypeScript imports and keep them clean and readable.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What it does](#what-it-does)
- [Usage](#usage)
- [Options](#options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

![Demo](https://raw.githubusercontent.com/kreuzerk/import-conductor/master/assets/demo.gif)

## What it does

Import conductor will order all imports into the following blocks:

```
1. Block - third party libraries

2. Block - user / company libraries

3. Block - imports from other modules or directories in your codebase

4. Block - imports for the same module
```

Take a look at the following source file. It's hard to distinguish
between third-party imports, company wide imports and files from same module.

```typescript
import { Component, OnInit } from '@angular/core';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import { Order } from '../order/order.model';
import { LoggerService } from '@myorg/logger';
import { Observable } from 'rxjs';
```

A cleaner version that is easy scannable would look like this:

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LoggerService } from '@myorg/logger';

import { Order } from '../order/order.model';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';
```

Of course, it's a lot of work to order all import statements in existing code bases.
Furthermore, in bigger development teams it's hard to enforce this syntax so that every
developer orders their imports accordingly. Especially with AutoImports in IDEs.

**That's where import-conductor comes into play**.
Import-conductor can reorder all imports in your project, and combined with tools like [`husky`](https://github.com/typicode/husky#readme) you can automatically reorder
imports of changed files in a pre commit hook.

## Usage

- Run in the command line:

```shell script
npx import-conductor -s customer.component.ts -p @myorg
```

- Run as a npm script:

```json
 "scripts": {
    "import-conductor": "import-conductor -p @myorg"
 },
```

- Integrate with tools like [`husky`](https://github.com/typicode/husky#readme):

```json
  "lint-staged": {
    "*.{ts,tsx}": [
      "import-conductor --staged -p @myorg",
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  },
```

## Options

- `source` - Regex to that matches the source files: (defaults to `[./src/**/*.ts]`)

```shell script
import-conductor --source mySrc/**/*.ts anotherSrc/**/*.ts
import-conductor -s mySrc/**/*.ts anotherSrc/**/*.ts
import-conductor mySrc/**/*.ts anotherSrc/**/*.ts
```

- `ignore`\* - Ignore files that match the pattern: (defaults to `[]`)

```shell script
import-conductor --ignore 'mySrc/**/*some.ts' 'main.ts'
import-conductor -i 'mySrc/**/*some.ts' 'main.ts'
```

**\*Note**: you can also skip a file by adding the following comment at the top:

```typescript
// import-conductor-skip
...
```

- `userLibPrefixes` - The prefix of custom user libraries - the prefix used to distinguish between third party libraries and company libs: (defaults to `[]`)

```shell script
import-conductor --userLibPrefixes @customA @customB
import-conductor -p @customA @customB
```

- `separator` - The string separator between the imports sections: (defaults to `\n`)

```shell script
import-conductor --separator '' ==> no separator
```

- `staged` - Run against staged files: (defaults to `false`)

```shell script
import-conductor --staged
```

- `noAutoMerge` - Disable automatically merging 2 import statements from the same source: (defaults to `false`)

```shell script
import-conductor --noAutoMerge
```

- `autoAdd` - Automatically adding the committed files when using the staged option: (defaults to `false`)

```shell script
import-conductor --autoAdd
import-conductor -a
```

- `dryRun` - Run without applying any changes: (defaults to `false`)

```shell script
import-conductor --dryRun
import-conductor -d
```

- `verbose` - Run with detailed log output: (defaults to `false`)

```shell script
import-conductor --verbose
import-conductor -v
```

- `version`:

```shell script
import-conductor --version
```

- `help`:

```shell script
import-conductor --help
import-conductor -h
```

## Core Team

<table>
  <tr>
    <td align="center"><a href="https://medium.com/@kevinkreuzer"><img src="https://avatars0.githubusercontent.com/u/5468954?v=4" width="100px;" alt=""/><br /><sub><b>Kevin Kreuzer</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/shaharkazaz"><img src="https://avatars2.githubusercontent.com/u/17194830?v=4" width="100px;" alt=""/><br /><sub><b>Shahar Kazaz</b></sub></a><br /></td>
  </tr>
</table>

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://medium.com/@kevinkreuzer"><img src="https://avatars0.githubusercontent.com/u/5468954?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Kreuzer</b></sub></a><br /><a href="https://github.com/kreuzerk/import-conductor/commits?author=kreuzerk" title="Code">💻</a> <a href="#design-kreuzerk" title="Design">🎨</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=kreuzerk" title="Documentation">📖</a> <a href="#ideas-kreuzerk" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-kreuzerk" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-kreuzerk" title="Maintenance">🚧</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=kreuzerk" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/shaharkazaz"><img src="https://avatars2.githubusercontent.com/u/17194830?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Shahar Kazaz</b></sub></a><br /><a href="https://github.com/kreuzerk/import-conductor/commits?author=shaharkazaz" title="Code">💻</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=shaharkazaz" title="Documentation">📖</a> <a href="#ideas-shaharkazaz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-shaharkazaz" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-shaharkazaz" title="Maintenance">🚧</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=shaharkazaz" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/laurenzcodes"><img src="https://avatars1.githubusercontent.com/u/8169746?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Robert Laurenz</b></sub></a><br /><a href="https://github.com/kreuzerk/import-conductor/commits?author=laurenzcodes" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Lonli-Lokli"><img src="https://avatars.githubusercontent.com/u/767795?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lonli-Lokli</b></sub></a><br /><a href="https://github.com/kreuzerk/import-conductor/commits?author=Lonli-Lokli" title="Code">💻</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=Lonli-Lokli" title="Tests">⚠️</a> <a href="https://github.com/kreuzerk/import-conductor/issues?q=author%3ALonli-Lokli" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
