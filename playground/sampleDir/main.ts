// file level comments shouldn't move
import { spawn } from 'child_process';
import fs from 'fs';
/**
 * important comment about Observables
 */
import { Observable } from 'rxjs';

// should be above this import
import { Order } from '../order/order.model';
import { Component, OnInit } from '@angular/core';
/* I will follow LoggerService wherever he goes */
import { LoggerService } from '@myorg/logger';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';
