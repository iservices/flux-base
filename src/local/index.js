import ControllerView from './controllerView';
import Page from './page';
import PageBuilder from './pageBuilder';
import Store from './store';
import View from './view';

/**
 * Holds references of all of the public classes in the package.
 */
class FluxBase {

  /**
   * Get the ControllerView class.
   */
  static get ControllerView() {
    return ControllerView;
  }

  /**
   * Get the Page class.
   */
  static get Page() {
    return Page;
  }

  /**
   * Get the PageBuilder class.
   */
  static get PageBuilder() {
    return PageBuilder;
  }

  /**
   * Get the Store class.
   */
  static get Store() {
    return Store;
  }

  /**
   * Get the View class.
   */
  static get View() {
    return View;
  }
}

export default FluxBase;
