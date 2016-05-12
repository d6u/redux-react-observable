import {Component, Children, PropTypes} from 'react';
import {Store, Unsubscribe} from 'redux';
import {ObserveObjectPath} from 'observe-object-path';
import {
  StoreObserverProviderContextType,
  StoreObserverProviderProps,
  StoreObserverProviderContext,
} from './interfaces';

export default class StoreObserverProvider extends Component<StoreObserverProviderProps, void> {

  static childContextTypes: StoreObserverProviderContextType = {
    observableStore: PropTypes.object.isRequired,
  };

  private store: Store<any>;
  private unsubscribe: Unsubscribe;
  private observableStore: ObserveObjectPath;

  constructor(props: StoreObserverProviderProps) {
    super(props);
    this.store = this.props.store;
    this.observableStore = new ObserveObjectPath(props.store.getState());
  }

  getChildContext(): StoreObserverProviderContext {
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
