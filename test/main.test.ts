import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDispatcher, dispatcher } from '../src/index';

describe('react-dispatch', () => {
  beforeEach(() => dispatcher.clear());

  it('subscribes and dispatches payloads', () => {
    const callback = vi.fn();
    dispatcher.on('test-event', callback);
    dispatcher.dispatch('test-event', { msg: 'hello' });
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith({ msg: 'hello' });
  });

  it('supports multiple subscribers', () => {
    const first = vi.fn();
    const second = vi.fn();
    dispatcher.on('multi-event', first);
    dispatcher.on('multi-event', second);
    dispatcher.dispatch('multi-event', 42);
    expect(first).toHaveBeenCalledWith(42);
    expect(second).toHaveBeenCalledWith(42);
  });

  it('fires once listeners only once', () => {
    const callback = vi.fn();
    dispatcher.once('once-event', callback);
    dispatcher.dispatch('once-event', 'first');
    dispatcher.dispatch('once-event', 'second');
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('first');
  });

  it('returns an unsubscribe function from on', () => {
    const callback = vi.fn();
    const unsubscribe = dispatcher.on('event', callback);
    unsubscribe();
    dispatcher.dispatch('event', 'data');
    expect(callback).not.toHaveBeenCalled();
  });

  it('removes only the requested callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    dispatcher.on('event', first);
    dispatcher.on('event', second);
    expect(dispatcher.off('event', first)).toBe(true);
    dispatcher.dispatch('event', 'data');
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('removes all listeners for one or many event names', () => {
    const first = vi.fn();
    const second = vi.fn();
    dispatcher.on('event1', first);
    dispatcher.once('event2', second);
    expect(dispatcher.off(['event1', 'event2'])).toBe(true);
    dispatcher.dispatch('event1', 'data');
    dispatcher.dispatch('event2', 'data');
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it('supports mixed on and once listeners', () => {
    const persistent = vi.fn();
    const once = vi.fn();
    dispatcher.on('mixed', persistent);
    dispatcher.once('mixed', once);
    dispatcher.dispatch('mixed', 1);
    dispatcher.dispatch('mixed', 2);
    expect(persistent).toHaveBeenCalledTimes(2);
    expect(once).toHaveBeenCalledOnce();
  });

  it('tracks listener counts and clear()', () => {
    dispatcher.on('counted', vi.fn());
    dispatcher.once('counted', vi.fn());
    expect(dispatcher.listenerCount('counted')).toBe(2);
    dispatcher.clear();
    expect(dispatcher.listenerCount('counted')).toBe(0);
  });

  it('creates isolated typed dispatchers', () => {
    type AppEvents = {
      login: { userId: string };
      logout: undefined;
    };

    const app = createDispatcher<AppEvents>();
    const callback = vi.fn();
    app.on('login', callback);
    app.dispatch('login', { userId: 'sam' });
    expect(callback).toHaveBeenCalledWith({ userId: 'sam' });
  });

  it('gracefully ignores invalid callbacks at runtime', () => {
    expect(() => {
      // @ts-expect-error runtime hardening
      dispatcher.on('invalid', 'not-a-function');
      dispatcher.dispatch('invalid', 'data');
    }).not.toThrow();
  });
});
