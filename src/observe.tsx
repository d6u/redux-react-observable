import React, {Component, PropTypes, ComponentClass, Validator} from 'react';
import {map, toPairs} from 'ramda';
import {
  StoreObserverProviderContext,
  StoreSelector,
  StoreObserverState,
  KeyPathHandlerPair,
  ObserverRegisterHandlerUnregister,
  ObserverRegisterHandlerEventType,
} from './interfaces';

export default function<P> (
  selector: StoreSelector<P>,
  Comp: ComponentClass<P>
): ComponentClass<P> {

  return class StoreObserver extends Component<P, StoreObserverState> {

    static contextTypes: {[key: string]: Validator<any>} = {
      observableStore: PropTypes.object.isRequired,
      observerRegister: PropTypes.func.isRequired,
    };
    static propTypes = Comp.propTypes;

    context: StoreObserverProviderContext;
    private keyPathHandlerPairs: KeyPathHandlerPair[];
    private observerRegisterUnregister: ObserverRegisterHandlerUnregister;
    private tempState: StoreObserverState;

    constructor(props, context) {
      super(props, context);
      this.state = {};
    }

    componentWillMount() {
      this.observerRegisterUnregister = this.context.observerRegister((type) => {
        if (type === ObserverRegisterHandlerEventType.StartUpdate) {
          this.tempState = {};
        } else if (type === ObserverRegisterHandlerEventType.FinishUpdate) {
          this.setState(this.tempState);
          this.tempState = null;
        }
      });
      this.onKeyPathHandlers(this.props);
    }

    componentWillUnmount() {
      this.offKeyPathHandlers();
      this.observerRegisterUnregister();
      this.observerRegisterUnregister = null;
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
          this.tempState[name] = value;
        };
        this.context.observableStore.on(keyPath, handler);
        return [keyPath, handler];
      });
    }

  };

}
