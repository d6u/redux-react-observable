declare module 'lodash/mapValues' {
  interface Iteratee<A, B> {
    (value: A, index: string, collection: {[key: string]: A}): {[key: string]: B};
  }

  interface MapValues {
    <A, B>(value: { [key: string]: A }, iteratee: Iteratee<A, B>): {[key: string]: B};
  }

  const mapValues: MapValues;

  export {mapValues as default};
}
