export type testCase = { input: string; expected: string };

export const readmeExample: testCase = {
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

export const secondRun: testCase = {
  input: readmeExample.expected,
  expected: readmeExample.expected,
};

export const comments: testCase = {
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
