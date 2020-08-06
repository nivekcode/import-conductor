![Logo](https://raw.githubusercontent.com/kreuzerk/import-conductor/master/assets/logo.png)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# import-conductor

> Automatically organize your TypeScript imports to keep them clean and readable.

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

4. Block - imports fro the same module
```

Take a look at the following source file. It's hard to distinguish
between third party imports, company wide imports and files from same module.

```
import { Component, OnInit } from '@angular/core';
import {CustomerService} from './customer.service';
import {Customer} from './customer.model';
import {Order} from '../order/order.model';
import {LoggerService} from '@myorg/logger';
import {Observable} from 'rxjs';
```

A cleaner version that is easy scannable would look like this:

```
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';

import {LoggerService} from '@myorg/logger';

import {Order} from '../order/order.model';

import {CustomerService} from './customer.service';
import {Customer} from './customer.model';
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
      "prettier --write",
      "eslint --fix",
      "import-conductor --staged -p @myorg",
      "git add"
    ]
  },
```

## Options

| Option               | Description                                                                                                             | Default value   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------- |
| -V --version         | Display the current version                                                                                             | `-`             |
| -h --help            | Show a help menu                                                                                                        | `-`             |
| -s --source          | Regex to that matches the source files                                                                                  | `./src/**/*.ts` |
| -p --userLibPrefixes | The prefix of custom user libraries - this prefix is used to distinguish between third party libraries and company libs | `[]`            |
| --staged             | Run against staged files                                                                                                | `false`         |
| -d --disableAutoAdd  | Disable automatically adding the committed files when the staged option is used                                         | `false`         |
| --silent             | Run with minimal log output                                                                                             | `false`         |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://medium.com/@kevinkreuzer"><img src="https://avatars0.githubusercontent.com/u/5468954?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Kreuzer</b></sub></a><br /><a href="https://github.com/kreuzerk/import-conductor/commits?author=kreuzerk" title="Code">💻</a> <a href="#design-kreuzerk" title="Design">🎨</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=kreuzerk" title="Documentation">📖</a> <a href="#ideas-kreuzerk" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-kreuzerk" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-kreuzerk" title="Maintenance">🚧</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=kreuzerk" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/shaharkazaz"><img src="https://avatars2.githubusercontent.com/u/17194830?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Shahar Kazaz</b></sub></a><br /><a href="https://github.com/kreuzerk/import-conductor/commits?author=shaharkazaz" title="Code">💻</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=shaharkazaz" title="Documentation">📖</a> <a href="#ideas-shaharkazaz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-shaharkazaz" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kreuzerk/import-conductor/commits?author=shaharkazaz" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
