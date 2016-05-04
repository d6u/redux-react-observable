import React, {Component, Children, PropTypes} from 'react';
import {ObserveObjectPath} from 'observe-object-path';
import {
  Unsubscribe,
  Store,
  ObservableStoreProps,
  ObservableStoreContext
} from './interfaces';

export default class ObservableStore extends Component<ObservableStoreProps, void> {

  static childContextTypes = {
    observableStore: PropTypes.object.isRequired
  };

  private observableStore: ObserveObjectPath;
  private unsubscribe: Unsubscribe;
  private store: Store;

  constructor(props: ObservableStoreProps) {
    super(props);
    this.store = this.props.store;
    this.observableStore = new ObserveObjectPath(props.store.getState());
  }

  getChildContext(): ObservableStoreContext {
    return {
      observableStore: this.observableStore,
    };
  }

  componentWillMount() {
    this.unsubscribe = this.store.subscribe(() => {
      this.observableStore.update(this.store.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe = null;
  }

  render() {
    return Children.only(this.props.children);
  }

}
