import { foo } from '../foo/foo';
import { quux } from './quux/quux';
const foo = 'foo';
import { quox } from './quux/quux';

export const bar = 'bar';

class Test {
  private baz: string;

  constructor() {
    this.baz = 'Blub';
  }
}
