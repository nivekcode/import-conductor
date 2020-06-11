import {SomeModule} from './someModule';
import {FooModule} from '../someModule';
import {environment} from './environments/environment';
import {enableProdMode} from '@angular/core';
import {enableProdMode} from '@custom/something';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(SomeModule)
    .catch(err => console.error(err));
