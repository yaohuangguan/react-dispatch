export type EventMap = Record<string, unknown>;
export type EventKey<Events extends EventMap> = Extract<keyof Events, string>;
export type EventHandler<T = unknown> = (data: T) => unknown;
export type Unsubscribe = () => void;

export interface Dispatcher<Events extends EventMap> {
  on<K extends EventKey<Events>>(event: K, callback: EventHandler<Events[K]>): Unsubscribe;
  once<K extends EventKey<Events>>(event: K, callback: EventHandler<Events[K]>): Unsubscribe;
  off<K extends EventKey<Events>>(event: K | K[], callback?: EventHandler<Events[K]>): boolean;
  dispatch<K extends EventKey<Events>>(event: K, data: Events[K]): void;
  clear(): void;
  listenerCount<K extends EventKey<Events>>(event: K): number;
}

export interface GlobalDispatcher {
  on<T = unknown>(event: string, callback: EventHandler<T>): Unsubscribe;
  once<T = unknown>(event: string, callback: EventHandler<T>): Unsubscribe;
  off<T = unknown>(event: string | string[], callback?: EventHandler<T>): boolean;
  dispatch<T = unknown>(event: string, data?: T): void;
  clear(): void;
  listenerCount(event: string): number;
}

type Handler = EventHandler<unknown>;

function createCore(): GlobalDispatcher {
  const events = new Map<string, Set<Handler>>();
  const onceEvents = new Map<string, Set<Handler>>();

  const add = (store: Map<string, Set<Handler>>, event: string, callback: Handler): Unsubscribe => {
    if (typeof callback !== 'function') return () => undefined;

    let handlers = store.get(event);
    if (!handlers) {
      handlers = new Set();
      store.set(event, handlers);
    }

    handlers.add(callback);
    return () => {
      const current = store.get(event);
      if (!current) return;
      current.delete(callback);
      if (current.size === 0) store.delete(event);
    };
  };

  const removeFrom = (store: Map<string, Set<Handler>>, event: string, callback?: Handler): boolean => {
    const handlers = store.get(event);
    if (!handlers) return false;
    if (!callback) return store.delete(event);

    const removed = handlers.delete(callback);
    if (handlers.size === 0) store.delete(event);
    return removed;
  };

  return {
    on<T = unknown>(event: string, callback: EventHandler<T>) {
      return add(events, event, callback as Handler);
    },

    once<T = unknown>(event: string, callback: EventHandler<T>) {
      return add(onceEvents, event, callback as Handler);
    },

    off<T = unknown>(event: string | string[], callback?: EventHandler<T>) {
      if (Array.isArray(event)) {
        let removed = false;
        for (const name of event) {
          removed = removeFrom(events, name) || removeFrom(onceEvents, name) || removed;
        }
        return removed;
      }

      return removeFrom(events, event, callback as Handler | undefined)
        || removeFrom(onceEvents, event, callback as Handler | undefined);
    },

    dispatch<T = unknown>(event: string, data?: T) {
      const onceHandlers = onceEvents.get(event);
      if (onceHandlers) {
        onceEvents.delete(event);
        for (const callback of [...onceHandlers]) callback(data);
      }

      const handlers = events.get(event);
      if (!handlers) return;
      for (const callback of [...handlers]) callback(data);
    },

    clear() {
      events.clear();
      onceEvents.clear();
    },

    listenerCount(event: string) {
      return (events.get(event)?.size ?? 0) + (onceEvents.get(event)?.size ?? 0);
    },
  };
}

export function createDispatcher<Events extends EventMap>(): Dispatcher<Events> {
  return createCore() as unknown as Dispatcher<Events>;
}

export const dispatcher: GlobalDispatcher = createCore();
