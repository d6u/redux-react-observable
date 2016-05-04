import {ObserveObjectPath} from 'observe-object-path';

export interface Unsubscribe {
  (): void;
}

export interface Store {
  subscribe(listener: () => void): Unsubscribe;
  getState(): any;
}

export interface ObservableStoreProps {
  store: Store;
}

export interface ObservableStoreContext {
  observableStore: ObserveObjectPath;
}

export interface KeyPathMap {
  [key: string]: string[];
}

export type StoreSelector<T> = (T) => KeyPathMap;

export interface StoreObserverState {
  [key: string]: any;
}

export type KeyPathHandler = (any) => void;

export type KeyPathHandlerPair = [string[], KeyPathHandler];

export type KeyPathHandlerPairs = KeyPathHandlerPair[];
