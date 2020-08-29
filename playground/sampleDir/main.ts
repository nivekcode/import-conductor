import { enableProdMode } from 'typescript';
import { platformBrowserDynamic } from 'glob';

import { enableProdMode } from '@custom/something';

import { FooModule } from '../someModule';

import { environment } from './environments/environment';
import { SomeModule } from './someModule';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(SomeModule)
  .catch((err) => console.error(err));
