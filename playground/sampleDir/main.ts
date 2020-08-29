import { sync } from 'glob';
import { isVariableDeclaration } from 'typescript';

import { FooModule } from '../someModule';
import { enableProdMode } from '@custom/something';

import { environment } from './environments/environment';
import { SomeModule } from './someModule';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(SomeModule)
  .catch((err) => console.error(err));
