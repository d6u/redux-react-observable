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

function getComp() {
  return class Comp extends React.Component {
    render() {
      return <div/>
    }
  }
}

function getMockStore() {
  return jasmine.createSpyObj('store', ['getState', 'subscribe']);
}

module.exports = {
  getChild,
  getComp,
  getMockStore,
};
