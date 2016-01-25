/**
 * Class used to build html output for pages.
 */
class PageBuilder {

  /**
   * @constructor.
   */
  constructor() {
    this.mStyleSheets = [];
    this.mScripts = [];
  }

  /**
   * Get the stylesheet tags for the page.
   */
  get styleSheets() {
    return this.mStyleSheets;
  }

  /**
   * Set the stylesheet tags for the page.
   * @param {String|String[]} value - A stylesheet tag or array of stylesheet tags.
   * @returns {void}
   */
  set styleSheets(value) {
    this.mStyleSheets = value;
  }

  /**
   * Get the script tags for the page.
   */
  get scripts() {
    return this.mScripts;
  }

  /**
   * Set the scripts tags for the page.
   * @param {String|String[]} value - A script tag or array of script tags.
   * @returns {void}
   */
  set scripts(value) {
    this.mScripts = value;
  }

  /**
   * Write the given page out to a string.
   * @param {Page} page - The page to render to a string.
   * @returns {String} A string representation of the given page.
   */
  renderToString(page) {
    const title = page.title || '';
    const styleSheets = (Array.isArray(this.styleSheets) ? this.styleSheets.join('\n    ') : this.styleSheets) || '';
    const scripts = (Array.isArray(this.scripts) ? this.scripts.join('\n    ') : this.scripts) || '';

    const element = page.buildElement();
    const body = element ? page.render() : '';

    return `<!DOCTYPE HTML>
<html>
  <head>
    <title>${title}</title>
    ${styleSheets}${scripts}
  </head>
  <body id="page-body">
    <div id="page-body-content">${body}</div>
  </body>
</html>`;
  }
}

export default PageBuilder;
