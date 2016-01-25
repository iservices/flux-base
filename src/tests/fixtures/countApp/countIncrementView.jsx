import Flux from '../../../local/index';
import React from 'react';

class CountIncrementView extends Flux.View {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.page.dispatcher.dispatch({ actionType: 'increment' });
  }

  render() {
    return (<div>
      <form>
        <button id="countIncrement" type="button" onClick={this.handleClick}>Add</button>
      </form>
    </div>);
  }
}

export default CountIncrementView;
