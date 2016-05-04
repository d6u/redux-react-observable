import React, {Component, Children, PropTypes, ComponentClass} from 'react';
import {ObserveObjectPath} from 'observe-object-path';
import {map, merge, toPairs} from 'ramda';
import {
  ObservableStoreContext,
  StoreSelector,
  StoreObserverState,
  KeyPathHandlerPairs
} from './interfaces';

export default function<P> (
  selector: StoreSelector<P>,
  Comp: ComponentClass<P>
): any {

  return class StoreObserver extends Component<P, StoreObserverState> {

    static contextTypes = {
      observableStore: PropTypes.object.isRequired
    };

    context: ObservableStoreContext;
    private keyPathHandlerPairs: KeyPathHandlerPairs;

    constructor(props, context) {
      super(props, context);
      this.state = {};
    }

    private offKeyPathHandlers() {
      if (this.keyPathHandlerPairs) {
        this.keyPathHandlerPairs.forEach(([keyPath, handler]) => {
          this.context.observableStore.off(keyPath, handler);
        });
      }
    }

    private onKeyPathHandlers(props: P) {
      this.offKeyPathHandlers();

      if (!this.keyPathHandlerPairs) {
        this.keyPathHandlerPairs = [];
      }

      const keyPathMap = selector(props);
      (toPairs(keyPathMap) as [string, string[]][]).forEach(([name, keyPath]) => {
        const handler = (value: any) => {
          this.setState({
            [name]: value,
          });
        };
        this.context.observableStore.on(keyPath, handler);
      });
    }

    componentWillMount() {
      const state = map<string[], any>(
        (paths) => this.context.observableStore.get(paths),
        selector(this.props)
      ) as StoreObserverState;
      this.setState(state);
      this.onKeyPathHandlers(this.props);
    }

    componentWillUnmount() {
      this.offKeyPathHandlers();
    }

    componentWillReceiveProps(nextProps: P) {
      this.onKeyPathHandlers(nextProps);
    }

    render() {
      return <Comp {...this.props} {...this.state} />;
    }

  }

}
