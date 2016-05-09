'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const ObserveObjectPath = require('observe-object-path').ObserveObjectPath;
const StoreObserverProvider = require('../../lib').StoreObserverProvider;
const {getChild, getMockStore} = require('../helpers');

describe('StoreObserverProvider', () => {

  it('adds "StoreObserverProvider" to child context', () => {
    const Child = getChild();
    const tree = TestUtils.renderIntoDocument(
      <StoreObserverProvider store={getMockStore()}>
        <Child/>
      </StoreObserverProvider>
    );
    const child = TestUtils.findRenderedComponentWithType(tree, Child);
    expect(child.context.observableStore instanceof ObserveObjectPath).toBeTruthy();
  });

  it('subscribe to store when mount', () => {
    const store = getMockStore();
    const tree = TestUtils.renderIntoDocument(
      <StoreObserverProvider store={store}>
        <div/>
      </StoreObserverProvider>
    );
    expect(store.subscribe).toHaveBeenCalled();
  });

  it('unsubscribe to store when unmount', () => {
    const store = getMockStore();
    const unsubscribe = jasmine.createSpy('unsubscribe');
    store.subscribe.and.callFake(() => unsubscribe);
    const container = document.createElement('div');
    ReactDOM.render(
      <StoreObserverProvider store={store}>
        <div/>
      </StoreObserverProvider>,
      container
    );
    ReactDOM.unmountComponentAtNode(container);
    expect(unsubscribe).toHaveBeenCalled();
  });

});
