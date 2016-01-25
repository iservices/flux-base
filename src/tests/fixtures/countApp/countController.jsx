import Flux from '../../../local/index';
import CountDisplay from './countDisplayView';
import CountIncrement from './countIncrementView';
import React from 'react';

class CountController extends Flux.ControllerView {

  constructor(props) {
    super(props);
    this.state = { count: this.props.store.getCount() };
    this.addStore(this.props.store);
  }

  handleStoreChange() {
    this.setState({ count: this.props.store.getCount() });
  }

  render() {
    return (<div>
      <CountDisplay count={this.state.count} />
      <CountIncrement />
    </div>);
  }
}

export default CountController;
