import {Store} from 'redux';
import {ObserveObjectPath} from 'observe-object-path';

export interface ObservableStoreProps {
  store: Store<any>;
}

export interface ObservableStoreContext {
  observableStore: ObserveObjectPath;
}

export interface KeyPathMap {
  [key: string]: string[];
}

export interface StoreSelector<T> {
  (props: T): KeyPathMap;
}

export interface StoreObserverState {
  [key: string]: any;
}

export interface KeyPathHandler {
  (value: any): void;
}

export type KeyPathHandlerPair = [string[], KeyPathHandler];
