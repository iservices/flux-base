import Flux from '../../../local/index';
import DetailView from './detailView';

class SimplePage extends Flux.Page {

  getComponent() {
    return DetailView;
  }
}

export default SimplePage;
