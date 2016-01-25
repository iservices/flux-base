import Flux from '../../../local/index';
import SubOneView from './subOneView';
import SubTwoView from './subTwoView';

class SubPage extends Flux.Page {

  getComponent() {
    return SubOneView;
  }

  routeSubTwo() {
    this.render(SubTwoView);
  }
}

export default SubPage;
