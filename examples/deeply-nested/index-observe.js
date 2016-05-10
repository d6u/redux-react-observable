'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux')
const {Provider, connect} = require('react-redux');
const Perf = require('react-addons-perf');
const {StoreObserverProvider, observe} = require('../../lib');

window.Perf = Perf;

function counter(state = {count: 0}, action) {
  switch (action.type) {
  case 'INCREMENT':
    return {count: state.count + 1};
  case 'DECREMENT':
    return {count: state.count - 1};
  default:
    return state;
  }
}

const store = createStore(counter);

setInterval(() => {
  store.dispatch({type: 'INCREMENT'})
}, 100);

class Counter extends React.Component {
  render() {
    return <div>{this.props.num}</div>
  }
}

const HigherOrder = observe(() => ({num: ['count']}), Counter);

class CompC extends React.Component {
  render() {
    return (
      <div>
        <HigherOrder/>
      </div>
    );
  }
}

class CompB extends React.Component {
  render() {
    return (
      <div>
        <CompC/>
      </div>
    );
  }
}

class CompA extends React.Component {
  render() {
    return (
      <div>
        <CompB/>
      </div>
    );
  }
}

Perf.start();
setTimeout(() => {
  Perf.stop();
  Perf.printWasted();
  Perf.printOperations();
}, 5000);

ReactDOM.render(
  <StoreObserverProvider store={store}>
    <CompA/>
  </StoreObserverProvider>,
  document.getElementById('app')
);
