import { actions, optimizeImports } from '@ic/conductor/optimize-imports';
import * as config from '@ic/config';
import fs from 'fs';
import { Config } from '@ic/types';

jest.mock('fs');

describe('optimizeImports', () => {
  const basicConfig: Config = {
    ignore: [],
    dryRun: false,
    verbose: false,
    staged: false,
    source: 'test.ts',
    userLibPrefixes: ['@myorg'],
    autoAdd: false,
    autoMerge: true,
    thirdPartyDependencies: new Set<string>(['@angular/core', 'rxjs']),
  };

  const readmeExample = `import fs from 'fs';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import { Order } from '../order/order.model';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@myorg/logger';
import { Observable } from 'rxjs';
import { spawn } from 'child_process';`;

  const expectedResult = `import { Component, OnInit } from '@angular/core';
import { spawn } from 'child_process';
import fs from 'fs';
import { Observable } from 'rxjs';

import { LoggerService } from '@myorg/logger';

import { Order } from '../order/order.model';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';`;

  beforeEach(() => {
    spyOn(config, 'getConfig').and.returnValue(basicConfig);
    (fs.existsSync as any).mockReturnValue(true);
  });

  it('should work with a basic example', async () => {
    (fs.readFileSync as any).mockReturnValue(Buffer.from(readmeExample));
    const file = 'test.ts';
    await optimizeImports(file);
    expect(fs.writeFileSync).toHaveBeenCalledWith(file, expectedResult);
  });

  it('should skip the file when skip comment exists', async () => {
    (fs.readFileSync as any).mockReturnValue(Buffer.from('// import-conductor-skip'));
    const file = 'test.ts';
    const result = await optimizeImports(file);
    expect(result).toBe(actions.skipped);
  });
});
