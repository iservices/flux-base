import Flux from '../../../local/index';
import MasterView from './masterView';

class MasterPage extends Flux.Page {

  getComponent() {
    return MasterView;
  }
}

export default MasterPage;
