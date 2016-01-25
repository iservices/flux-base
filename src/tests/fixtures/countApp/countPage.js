import Flux from '../../../local/index';
import CountController from './countController';
import CountStore from './countStore';

class SimplePage extends Flux.Page {

  constructor(opts) {
    super(opts);
    this.mStore = new CountStore();
  }

  getComponent() {
    return CountController;
  }

  getProps() {
    return { store: this.mStore };
  }
}

export default SimplePage;
