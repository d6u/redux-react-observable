import React, {Component, PropTypes, ComponentClass} from 'react';
import mapValues from 'lodash/mapValues';
import {
  StoreObserverProviderContextType,
  StoreObserverProviderContext,
  StoreSelector,
  StoreObserverState,
  ChangeHandler,
  KeyPathMap,
} from './interfaces';

export default function<P> (
  selector: StoreSelector<P>,
  Comp: ComponentClass<P>
): ComponentClass<P> {

  return class StoreObserver extends Component<P, StoreObserverState> {

    static contextTypes: StoreObserverProviderContextType = {
      observableStore: PropTypes.object.isRequired,
    };
    static propTypes = Comp.propTypes;

    public context: StoreObserverProviderContext;

    private changeHandler: ChangeHandler;
    private keyPathMap: KeyPathMap;

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
      return mapValues<string[], any>(
        selector(props),
        (paths) => this.context.observableStore.get(paths)
      );
    }

    private offKeyPathHandlers() {
      if (this.keyPathMap && this.changeHandler) {
        this.context.observableStore.off(this.keyPathMap, this.changeHandler);
      }
    }

    private onKeyPathHandlers(props: P) {
      this.offKeyPathHandlers();

      const state = this.getCurrentState(props);
      this.setState(state);

      this.keyPathMap = selector(props);
      this.changeHandler = (newState: StoreObserverState) => {
        this.setState(newState);
      };

      this.context.observableStore.on(this.keyPathMap, this.changeHandler);
    }

  };

}
