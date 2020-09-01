// file level comments shouldn't move
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
import { spawn } from 'child_process';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(SomeModule)
  .catch((err) => console.error(err));
