import { optimizeImports } from '../optimize-imports';
import * as config from '../config';
import fs from 'fs';

jest.mock('fs');

describe('optimizeImports', () => {
  const basicConfig = {
    silent: true,
    staged: false,
    source: 'test.ts',
    userLibPrefixes: ['@myorg'],
    autoAdd: true,
    thirdPartyDependencies: new Set<string>(['@angular/core', 'rxjs']),
    autoMerge: true,
  };

  const readmeExample = `import { Component, OnInit } from '@angular/core';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import { Order } from '../order/order.model';
import { LoggerService } from '@myorg/logger';
import { Observable } from 'rxjs';`;

  const expectedResult = `import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LoggerService } from '@myorg/logger';

import { Order } from '../order/order.model';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';`;

  beforeEach(() => {
    spyOn(config, 'getConfig').and.returnValue(basicConfig);
  });

  it.only('should work with a basic example', async () => {
    (fs.readFileSync as any).mockReturnValue(new Buffer(readmeExample));
    const file = 'test.ts';
    await optimizeImports(file);
    expect(fs.writeFileSync).toHaveBeenCalledWith(file, expectedResult);
  });
});
