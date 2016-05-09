import React, {Component, PropTypes, ComponentClass, Validator} from 'react';
import {map, toPairs} from 'ramda';
import {
  StoreObserverProviderContext,
  StoreSelector,
  StoreObserverState,
  KeyPathHandlerPair,
} from './interfaces';

export default function<P> (
  selector: StoreSelector<P>,
  Comp: ComponentClass<P>
): ComponentClass<P> {

  return class StoreObserver extends Component<P, StoreObserverState> {

    static contextTypes: {[key: string]: Validator<any>} = {
      observableStore: PropTypes.object.isRequired,
    };
    static propTypes = Comp.propTypes;

    context: StoreObserverProviderContext;
    private keyPathHandlerPairs: KeyPathHandlerPair[];

    constructor(props, context) {
      super(props, context);
      this.state = {};
    }

    componentWillMount() {
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

    private getCurrentState(props: P): StoreObserverState {
      return map<string[], any>(
        (paths) => this.context.observableStore.get(paths),
        selector(props)
      );
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

      const state = this.getCurrentState(props);
      this.setState(state);

      const keyPathMap = selector(props);
      const pairs = toPairs(keyPathMap) as [string, string[]][];
      this.keyPathHandlerPairs = pairs.map<KeyPathHandlerPair>(([name, keyPath]) => {
        const handler = (value: any) => {
          this.setState({
            [name]: value,
          });
        };
        this.context.observableStore.on(keyPath, handler);
        return [keyPath, handler];
      });
    }

  };

}
