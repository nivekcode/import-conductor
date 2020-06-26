![Logo](https://raw.githubusercontent.com/kreuzerk/import-conductor/master/assets/logo.png)

# import-conductor

> Automatically organize your import statements to keep your code clean
> and readable.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [import-conductor](#import-conductor)
  - [What it does](#what-it-does)
  - [Usage](#usage)
  - [Arguments](#arguments)

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
Import conductor can reorder all imports in your project and you can run
in combination with tools like for example `husky` to automatically reorder
import of changed files in a pre commit hook.

## Usage

`import-conductor` can be run via command line or as part of your npm scripts.

## Arguments

| Argument             | Description                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| -s --source          | regex to that matches the source files                                                                                  |
| -p --userLibPrefixes | the prefix of custom user libraries - this prefix is used to distinguish between third party libraries and company libs |
| --staged             | run against staged files                                                                                                |
| -d --disableAutoAdd  | disable automatically adding the commited files when the staged option is used                                          |
