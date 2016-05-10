import {Component, Children, PropTypes} from 'react';
import {Store, Unsubscribe} from 'redux';
import {ObserveObjectPath} from 'observe-object-path';
import {
  StoreObserverProviderProps,
  StoreObserverProviderContext,
  ObserverRegisterHandlerUnregister,
  ObserverRegisterHandler,
  ObserverRegisterHandlerEventType,
} from './interfaces';

export default class StoreObserverProvider extends Component<StoreObserverProviderProps, void> {

  static childContextTypes = {
    observableStore: PropTypes.object.isRequired,
    observerRegister: PropTypes.func.isRequired,
  };

  private observableStore: ObserveObjectPath;
  private unsubscribe: Unsubscribe;
  private store: Store<any>;
  private registeredHandlers: ObserverRegisterHandler[];

  constructor(props: StoreObserverProviderProps) {
    super(props);
    this.store = this.props.store;
    this.observableStore = new ObserveObjectPath(props.store.getState());
    this.registeredHandlers = [];
  }

  getChildContext(): StoreObserverProviderContext {
    return {
      observableStore: this.observableStore,
      observerRegister: this.observerRegister.bind(this),
    };
  }

  componentWillMount() {
    this.unsubscribe = this.store.subscribe(() => {
      this.registeredHandlers.forEach((h) => h(ObserverRegisterHandlerEventType.StartUpdate));
      this.observableStore.update(this.store.getState());
      this.registeredHandlers.forEach((h) => h(ObserverRegisterHandlerEventType.FinishUpdate));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe = null;
  }

  render() {
    return Children.only(this.props.children);
  }

  private observerRegister(handler: ObserverRegisterHandler): ObserverRegisterHandlerUnregister {
    this.registeredHandlers.push(handler);
    return () => {
      const i = this.registeredHandlers.findIndex((h) => handler === h);
      if (i > -1) {
        this.registeredHandlers.splice(i, 1);
      }
    };
  }

}
