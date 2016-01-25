import Flux from '../../../local/index';
import React from 'react';

class MasterView extends Flux.View {

  render() {
    return (<div>
      <span>Start</span>
      {this.props.children}
      <span>End</span>
    </div>);
  }
}

export default MasterView;
