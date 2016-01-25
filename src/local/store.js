import emitter from 'event-emitter';
import Reflect from './reflect';
import Page from './page';

/**
 * Base class for stores.
 */
class Store {

  /**
   * @constructor
   */
  constructor() {
    this.mRegisterToken = null;
    this.mEmitter = emitter();

    this.initActionRouter();
    this.registerDispatch();
  }

  /**
   * Get the page associated with this store.
   */
  get page() {
    return Page.current;
  }

  /**
   * Get the token for the registration with the dispatcher.
   */
  get registerToken() {
    return this.mRegisterToken;
  }

  /**
   * Register this store with the dispatcher.
   * @returns {void}
   */
  registerDispatch() {
    if (this.registerToken) {
      return;
    }
    if (this.page) {
      this.mRegisterToken = this.page.dispatcher.register(this.handleAction.bind(this));
    }
  }

  /**
   * Unregister this store with the dispatcher.
   * @returns {void}
   */
  unregisterDispatch() {
    if (!this.mRegisterToken) {
      return;
    }
    if (this.page) {
      this.page.dispatcher.unregister(this.registerToken);
      this.mRegisterToken = null;
    }
  }

  /**
   * Reflect the class and record functions that actions should be routed to.
   * @returns {void}
   */
  initActionRouter() {
    // get all of the functions defined on the prototype
    const propNames = Reflect.getPropertyNames(
      Object.getPrototypeOf(this),
      Store.prototype
    );

    this.actionRoutes = {};
    for (let propIndex = 0; propIndex < propNames.length; propIndex++) {
      // collect all property names that begin with the text 'action'
      const propName = propNames[propIndex];
      if (Reflect.isFunction(this[propName]) && propName.length > 6 && propName.indexOf('action') === 0) {
        const action = propName[6].toLowerCase() + propName.slice(7);
        this.actionRoutes[action] = propName;
      }
    }
  }

  /**
   * This is called when an action occurs.
   * @param {Object} details - The details about the action that has occured.
   * @returns {Boolean} - true if the action was processed, false if it wasn't.
   */
  handleAction(details) {
    const route = this.actionRoutes[details.actionType];
    if (route) {
      this[route].apply(this, [details]);
      return true;
    }

    return false;
  }

  /**
   * Listen for changes to this store.
   * @param {Function} func - The function to call when a change occurs.
   * @returns {void}
   */
  onChange(func) {
    this.mEmitter.on('change', func);
  }

  /**
   * Remove change listener.
   * @param {Function} func - The function to remove from being notified of changes.
   * @returns {void}
   */
  offChange(func) {
    this.mEmitter.off('change', func);
  }

  /**
   * Notify listeners that the store has been changed.
   * @returns {void}
   */
  emitChange() {
    this.mEmitter.emit('change', this);
  }
}

export default Store;
