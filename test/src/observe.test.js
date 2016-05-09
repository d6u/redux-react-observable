'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const ObserveObjectPath = require('observe-object-path').ObserveObjectPath;
const {StoreObserverProvider, observe} = require('../../lib');
const {getMockStore, getComp} = require('../helpers');

describe('observe', () => {

  it('gives current props to component when mount', () => {
    const Comp = getComp();
    const store = getMockStore();
    store.getState.and.callFake(() => ({a: 1, b: 2}));
    const HigherOrderComp = observe(() => ({propA: ['a'], propB: ['b']}), Comp);

    const tree = TestUtils.renderIntoDocument(
      <StoreObserverProvider store={store}>
        <HigherOrderComp/>
      </StoreObserverProvider>
    );

    const child = TestUtils.findRenderedComponentWithType(tree, Comp);
    expect(child.props).toEqual({propA: 1, propB: 2});
  });

  it('gives new props to component when store updates', () => {
    const Comp = getComp();
    const store = getMockStore();
    store.getState.and.callFake(() => ({a: 1, b: 2}));
    const HigherOrderComp = observe(() => ({propA: ['a'], propB: ['b']}), Comp);
    const tree = TestUtils.renderIntoDocument(
      <StoreObserverProvider store={store}>
        <HigherOrderComp/>
      </StoreObserverProvider>
    );
    store.getState.and.callFake(() => ({a: 3, b: 4}));

    store.subscribe.calls.mostRecent().args[0]();

    const child = TestUtils.findRenderedComponentWithType(tree, Comp);
    expect(child.props).toEqual({propA: 3, propB: 4});
  });

  it('passes down props to component', () => {
    const Comp = getComp();
    const store = getMockStore();
    const HigherOrderComp = observe(() => ({}), Comp);

    const tree = TestUtils.renderIntoDocument(
      <StoreObserverProvider store={store}>
        <HigherOrderComp a='1' b='2'/>
      </StoreObserverProvider>
    );

    const child = TestUtils.findRenderedComponentWithType(tree, Comp);
    expect(child.props).toEqual({a: '1', b: '2'});
  });

});
