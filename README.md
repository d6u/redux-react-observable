# Redux React Observable

[![npm version](https://badge.fury.io/js/redux-react-observable.svg)](https://badge.fury.io/js/redux-react-observable)
[![Circle CI](https://circleci.com/gh/d6u/redux-react-observable/tree/master.svg?style=svg)](https://circleci.com/gh/d6u/redux-react-observable/tree/master)

**This is an experiment**

Efficient and descriptive Redux React binding.

## Why & Benefits

Unlike `connect` in react-redux, redux-react-observable will update tree leaf component directly, rather than passing down props at each level. This way we can skip middle level components and directly update deeply nested components. Also the `selector` is kinda descriptive. In the future, we might be able to add data dependency deceleration and fetch data automatically without writing any additional code.

## Usage

```sh
npm i -S redux-react-observable
```

redux-react-observable requires react and redux (no need of react-redux) to work

```sh
npm i -S react react-dom redux
```

```js
'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux')
const {StoreObserverProvider, observe} = require('redux-react-observable');

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
```

## API

### `<StoreObserverProvider store>`

- `store` Redux store instance

### `observe(selector, Component): Component`

- `selector: (props: any) => {[key: string]: string[]}` Return higher order component. Props passed to higher order component will pass to selector function as first argument. Must return an object. Object keys will become the props' name of wrapped component. Object values must be an array of string or number, a.k.a. key path. Those key paths will be used to get values from the Redux store. The value related to key path will be assigned to props of the wrapped component. _New props will be passed to wrapped component only when key path related value has changed by using a deep equal comparison._
- `Component: React.Component` A wrapped component
