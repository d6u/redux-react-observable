# Redux Observe Store Path

[![Circle CI](https://circleci.com/gh/d6u/redux-observe-store-path/tree/master.svg?style=svg)](https://circleci.com/gh/d6u/redux-observe-store-path/tree/master)

Descriptive Redux React binding

## Usage

```sh
npm i -S redux-observe-store-path
```

```js
'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux')
const {StoreObserverProvider, observe} = require('redux-observe-store-path');

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

class Counter extends React.Component {
  render() {
    return <div>{this.props.count}</div>;
  }
}

const HigherOrder = observe(
  () => ({count: ['count']}),
  Counter
);

ReactDOM.render(
  <StoreObserverProvider store={store}>
    <HigherOrder/>
  </StoreObserverProvider>,
  document.getElementById('app')
);

setInterval(() => {
  store.dispatch({ type: 'INCREMENT' })
}, 100);
```
