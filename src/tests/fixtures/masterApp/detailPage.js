import MasterPage from './masterPage';
import DetailView from './detailView';

class DetailPage extends MasterPage {

  getComponent() {
    return DetailView;
  }
}

export default DetailPage;
