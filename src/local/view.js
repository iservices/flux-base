import React from 'react';
import Page from './page';

/**
 * A view on the page.
 */
class View extends React.Component {

  /**
   * @constructor
   * @param {Object} props - Properties for the component.
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Get the page associated with this view.
   */
  get page() {
    return Page.current;
  }

  /**
   * Helper function used to update state with value from an html element that has a value attribute.
   * @param {String} name - The name of the state value to update.
   * @param {Event} event - The event details.
   * @returns {void}
   */
  handleValueChange(name, event) {
    const input = {};
    input[name] = event.target.value;
    this.setState(input);
  }
}

export default View;
