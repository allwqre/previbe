import { Accessor, createMemo } from 'solid-js';
import { createStore as solidStore, DeepMutable, DeepReadonly, produce } from 'solid-js/store';

type TSelector<T, P> = (store: DeepReadonly<T>) => P;
type TUseStore<T> = <P>(selector: TSelector<T, P>) => Accessor<P>;
type TMutator<T> = (draft: DeepMutable<DeepReadonly<T>>) => void;
type TMutate<T> = (mutator: TMutator<T>) => void;

interface IStore<T> {
  useStore: TUseStore<T>;
  mutate: TMutate<T>;
}

type TCreateStore = <T>(initial: T, options?: { name?: string }) => IStore<T>;

export const createStore: TCreateStore = (initial, options) => {
  const [store, setStore] = solidStore(initial, options);

  return {
    useStore: (selector) => createMemo(() => selector(store)),
    mutate: (mutator) => setStore(produce((draft) => mutator(draft))),
  };
};
