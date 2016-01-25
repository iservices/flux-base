import Flux from '../../../local/index';

class CountStore extends Flux.Store {

  constructor() {
    super();
    this.mCount = 0;
  }

  getCount() {
    return this.mCount;
  }

  actionIncrement() {
    this.mCount = this.mCount + 1;
    this.emitChange();
  }
}

export default CountStore;
