export type TestCase = { input: string; expected: string; noOfRuns?: number; groupOrder?: string[] };

export const readmeExample: TestCase = {
  input: `import fs from 'fs';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import { Order } from '../order/order.model';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@myorg/logger';
import { Observable } from 'rxjs';
import { spawn } from 'child_process';`,
  expected: `import { Component, OnInit } from '@angular/core';
import { spawn } from 'child_process';
import fs from 'fs';
import { Observable } from 'rxjs';

import { LoggerService } from '@myorg/logger';

import { Order } from '../order/order.model';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';`,
};

export const comments: TestCase = {
  input: `// file level comments shouldn't move
import fs from 'fs';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
// should be above this import
import { Order } from '../order/order.model';
import { Component, OnInit } from '@angular/core';
/* I will follow LoggerService wherever he goes */
import { LoggerService } from '@myorg/logger';
/**
* important comment about Observables  
*/
import { Observable } from 'rxjs';
import { spawn } from 'child_process';`,
  expected: `// file level comments shouldn't move
import { Component, OnInit } from '@angular/core';
import { spawn } from 'child_process';
import fs from 'fs';
/**
* important comment about Observables  
*/
import { Observable } from 'rxjs';

/* I will follow LoggerService wherever he goes */
import { LoggerService } from '@myorg/logger';

// should be above this import
import { Order } from '../order/order.model';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';`,
};

export const codeBetweenImports: TestCase = {
  input: `/* file level comments shouldn't move
and another line */
import fs from 'fs';
/// <reference types='./types' />

declare var global: any**
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';

import { Order } from '../order/order.model';

if (environment.production) {
  enableProdMode();
}

import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@myorg/logger';
import { Observable } from 'rxjs';
import { spawn } from 'child_process';`,
  expected: `/* file level comments shouldn't move
and another line */
import { Component, OnInit } from '@angular/core';
import { spawn } from 'child_process';
import fs from 'fs';
import { Observable } from 'rxjs';

import { LoggerService } from '@myorg/logger';

import { Order } from '../order/order.model';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';
/// <reference types='./types' />

declare var global: any**

if (environment.production) {
  enableProdMode();
}`,
};

export const emptyNewLineSeparator: TestCase = {
  noOfRuns: 2,
  input: `import { Component, HostListener } from '@angular/core';
  import { Observable } from 'rxjs';
  import { MatDialogRef } from '@angular/material/dialog';

  
  import { AboutDialogBloc, AboutState } from './about-dialog.bloc';`,
  expected: `import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AboutDialogBloc, AboutState } from './about-dialog.bloc';`,
};

export const noImportStatement: TestCase = {
  input: `const x = 2;`,
  expected: `const x = 2;`,
};

export const importsOnDifferentGroupOrder: TestCase = {
  groupOrder: ['userLibrary', 'sameModule', 'differentModule', 'thirdParty'],
  input: `import { Component } from '@angular/core';
import fs from 'fs';
import { LoggerService } from '@myorg/logger';
import { Order } from '../order/order.model';
import { CustomService } from './customer.service';`,
  expected: `import { LoggerService } from '@myorg/logger';
import { CustomService } from './customer.service';
import { Order } from '../order/order.model';
import { Component } from '@angular/core';
import fs from 'fs';`,
};

export const importsWithGroupOrderIncorrect: TestCase = {
  groupOrder: ['userLibrary', 'differentModule', 'thirdParty'],
  input: `import fs from 'fs';
import { CustomerService } from './customer.service';
import { Order } from '../order/order.model';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@myorg/logger';
import { Observable } from 'rxjs';
import { spawn } from 'child_process';`,
  expected: `import { Component, OnInit } from '@angular/core';
import { spawn } from 'child_process';
import fs from 'fs';
import { Observable } from 'rxjs';

import { LoggerService } from '@myorg/logger';

import { Order } from '../order/order.model';

import { CustomerService } from './customer.service';`,
};
