import {Store} from 'redux';
import {ObserveObjectPath} from 'observe-object-path';

export interface StoreObserverProviderProps {
  store: Store<any>;
}

export interface StoreObserverProviderContext {
  observableStore: ObserveObjectPath;
  observerRegister: (handler: ObserverRegisterHandler) => ObserverRegisterHandlerUnregister;
}

export interface ObserverRegisterHandlerUnregister {
  (): void;
}

export enum ObserverRegisterHandlerEventType {
  StartUpdate,
  FinishUpdate,
}

export interface ObserverRegisterHandler {
  (type: ObserverRegisterHandlerEventType): void;
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
