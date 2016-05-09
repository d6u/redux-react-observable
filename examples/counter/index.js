'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux')
const {StoreObserverProvider, observe} = require('../../lib');

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

// Create pure function component
const Counter = (props) => (
  <div>{props.num}</div>
);

// Wrap Counter with higher order component
const HigherOrder = observe(
  function () {
    // This is our store path selector
    return {
      num: ['count']
    };
  },
  Counter
);

// If you know react-redux's <Provider>, you know <StoreObserverProvider>
ReactDOM.render(
  <StoreObserverProvider store={store}>
    <HigherOrder/>
  </StoreObserverProvider>,
  document.getElementById('app')
);

setInterval(() => {
  store.dispatch({type: 'INCREMENT'})
}, 100);
