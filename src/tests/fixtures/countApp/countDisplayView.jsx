import Flux from '../../../local/index';
import React from 'react';

class CountDisplayView extends Flux.View {

  render() {
    return (<div>
      <span>Count: </span><span id="countDisplay">{this.props.count}</span>
    </div>);
  }
}

export default CountDisplayView;
