'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux')
const {Provider, connect} = require('react-redux');
const Perf = require('react-addons-perf');

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

class CompC extends React.Component {
  render() {
    return (
      <div>
        <Counter num={this.props.num}/>
      </div>
    );
  }
}

class CompB extends React.Component {
  render() {
    return (
      <div>
        <CompC num={this.props.num}/>
      </div>
    );
  }
}

class CompA extends React.Component {
  render() {
    return (
      <div>
        <CompB num={this.props.num}/>
      </div>
    );
  }
}

const App = connect(({count}) => ({num: count}))(CompA);

Perf.start();
setTimeout(() => {
  Perf.stop();
  Perf.printOperations();
}, 5000);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
