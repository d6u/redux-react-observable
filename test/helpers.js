'use strict';

const React = require('react');

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
  return jasmine.createSpyObj('store', ['getState', 'subscribe']);
}

module.exports = {
  getChild,
  getMockStore,
};
