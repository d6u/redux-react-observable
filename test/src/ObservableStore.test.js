'use strict';

const React = require('react');
const TestUtils = require('react-addons-test-utils');
const ObserveObjectPath = require('observe-object-path').ObserveObjectPath;
const ObservableStore = require('../../lib').ObservableStore;

describe('ObservableStore', () => {

  it('it adds "observableStore" to child context', () => {
    const Child = getChild();
    const tree = TestUtils.renderIntoDocument(
      <ObservableStore store={getMockStore()}>
        <Child/>
      </ObservableStore>
    );
    const child = TestUtils.findRenderedComponentWithType(tree, Child);
    expect(child.context.observableStore instanceof ObserveObjectPath).toBeTruthy();
  });

});

function getChild() {
  class Child extends React.Component {
    render() {
      return <div/>
    }
  }

  Child.contextTypes = {
    observableStore: React.PropTypes.object.isRequired,
  };

  return Child;
}

function getMockStore() {
  return {
    getState: () => null,
    subscribe: () => null,
  };
}
