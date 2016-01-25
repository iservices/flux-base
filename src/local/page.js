import Director from 'director';
import Flux from 'flux';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Reflect from './reflect';

// A singleton instance of Page.
let currentPage = null;

/**
 * Abstract definition of a page.
 */
class Page {

  /**
   * Constructor.
   * @param {Object} [options] - Options for this page.
   * @param {String} [options.title] - The title for the page.
   * @param {String} [options.containerId] - The id of the container the page will be rendered into.  Default is page-body-content.
   * @param {Boolean} [options.isBrowserContext] - When set the value will override the normal check done to detrmine if the page is running in a browser.
   * @returns {void}
   */
  constructor(options) {
    currentPage = this;
    const opts = options || {};

    this.mIsInitialized = false;
    this.mDispatcher = new Flux.Dispatcher();

    this.mTitle = opts.title || '';
    this.mContainerId = opts.containerId || 'page-body-content';
    this.mIsBrowserContext = opts.isBrowserContext;
  }

  /**
   * The single instance of the page when in a browser context.
   * This gets set when the load function is called.
   */
  static get current() {
    return currentPage;
  }

  /**
   * Get the dispatcher being used for this page.
   */
  get dispatcher() {
    return this.mDispatcher;
  }

  /**
   * Returns true if the page is running in the browser, false if it isn't.
   */
  get isBrowserContext() {
    if (this.mIsBrowserContext !== undefined) {
      return this.mIsBrowserContext;
    }
    return Reflect.isBrowserContext();
  }

  /**
   * Get the title for this page.
   */
  get title() {
    if (this.isBrowserContext) {
      return document.title;
    }
    return this.mTitle;
  }

  /**
   * Set the title for this page.
   * @param {String} value - The value for the page title.
   * @returns {void}
   */
  set title(value) {
    if (this.isBrowserContext) {
      document.title = value;
    } else {
      this.mTitle = value;
    }
  }

  /**
   * This should be called after the page is created and it's ready to be displayed.
   * @returns {void}
   */
  load() {
    if (!this.mIsInitialized) {
      this.mIsInitialized = true;
      this.title = this.mTitle;
      this.render();
      this.initRouter();
    }
  }

  /**
   * Setup the routing for the page.  Only works in the browser.
   * @returns {void}
   */
  initRouter() {
    if (!this.isBrowserContext) {
      return;
    }

    // get all of the functions defined on the prototype
    const propNames = Reflect.getPropertyNames(
      Object.getPrototypeOf(this),
      Page.prototype
    );

    const routes = {};
    for (let propIndex = 0; propIndex < propNames.length; propIndex++) {
      // collect all property names that begin with the text 'route'
      const propName = propNames[propIndex];
      if (Reflect.isFunction(this[propName]) && propName.indexOf('route') === 0) {
        let pathName = '?((\\w|.)*)';
        if (propName.length > 5) {
          pathName = propName.slice(5);
          pathName = '/' + pathName[0].toLowerCase() + pathName.slice(1);
        }

        const callFunc = () => { // eslint-disable-line no-loop-func
          this[propName].apply(this, arguments);
        };

        // route without any params set
        routes[pathName] = callFunc;

        // get all of the parameters that will be included in the routing definition
        const params = Reflect.getParameterNames(this[propName]);
        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
          if (paramIndex === params.length - 1 && params[paramIndex] === 'any') {
            pathName += '/?((\\w|.)*)';
          } else {
            pathName += '/:' + params[paramIndex];
          }
          // route with optional parameters set
          routes[pathName] = callFunc;
        }
      }
    }

    // hook up the router
    this.mRouter = new Director.Router(routes);
    if (this.mRouter.init) {
      this.mRouter.init();
    }
  }

  /**
   * The default route which gets called if no other route matches.
   * The default page gets rendered in this case.
   * @returns {void}
   */
  route() {
    this.render();
  }

  /**
   * Render the content for this page.
   * @param {String|ReactClass} [component] - The component to render.  If not set the result from the getComponent function is used.
   * @param {Object} [props] - The props for the component to be rendered.  If not set the result from the getProps function is used.
   * @returns {String|Ref} - If on the client this method returns a React ref.  If on the server this returns a string.
   */
  render(component, props) {
    const element = this.buildElement(component, props);
    if (element) {
      if (!this.isBrowserContext) {
        return ReactDOMServer.renderToString(element);
      }

      return ReactDOM.render(
        element,
        document.getElementById(this.mContainerId)
      );
    }
  }

  /**
   * Build an element that will include the content from the current page and all of it's ancestor pages.
   * @param {String|ReactClass} [component] - The component to render.
   * @param {Object} [props] - The props for the component to be rendered.
   * @returns {ReactElement} The resulting element or null if there isn't any content.
   */
  buildElement(component, props) {
    // get all of the functions defined on the prototype chain
    const ptype = Object.getPrototypeOf(this);
    const funcList = Reflect.getFunctionChain(
      ['getComponent', 'getProps'],
      component ? Object.getPrototypeOf(ptype) : ptype,
      Page.prototype
    );

    // build element using function chain
    let element = component ? React.createElement(component, props) : null;
    for (let index = 0; index < funcList.length; index++) {
      if (funcList[index].getComponent) {
        const compProps = funcList[index].getProps ? funcList[index].getProps.call(this) : {};
        element = React.createElement(funcList[index].getComponent.call(this), compProps, element);
      }
    }

    return element;
  }
}

export default Page;
