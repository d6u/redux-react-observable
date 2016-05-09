'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const ObserveObjectPath = require('observe-object-path').ObserveObjectPath;
const {getChild, getMockStore} = require('../helpers');
const ObservableStore = require('../../lib').ObservableStore;

describe('ObservableStore', () => {

  it('adds "observableStore" to child context', () => {
    const Child = getChild();
    const tree = TestUtils.renderIntoDocument(
      <ObservableStore store={getMockStore()}>
        <Child/>
      </ObservableStore>
    );
    const child = TestUtils.findRenderedComponentWithType(tree, Child);
    expect(child.context.observableStore instanceof ObserveObjectPath).toBeTruthy();
  });

  it('subscribe to store when mount', () => {
    const store = getMockStore();
    const tree = TestUtils.renderIntoDocument(
      <ObservableStore store={store}>
        <div/>
      </ObservableStore>
    );
    expect(store.subscribe).toHaveBeenCalled();
  });

  it('unsubscribe to store when unmount', () => {
    const store = getMockStore();
    const unsubscribe = jasmine.createSpy('unsubscribe');
    store.subscribe.and.callFake(() => unsubscribe);
    const container = document.createElement('div');
    ReactDOM.render(
      <ObservableStore store={store}>
        <div/>
      </ObservableStore>,
      container
    );
    ReactDOM.unmountComponentAtNode(container);
    expect(unsubscribe).toHaveBeenCalled();
  });

});
