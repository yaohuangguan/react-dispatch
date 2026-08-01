import { describe, it, expect, vi } from 'vitest';
import { dispatcher } from '../src/main';

describe('react-dispatch', () => {
  it('should subscribe to and receive event data', () => {
    const callback = vi.fn();
    dispatcher.on('test-event', callback);

    dispatcher.dispatch('test-event', { msg: 'hello' });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ msg: 'hello' });

    // Clean up
    dispatcher.off('test-event');
  });

  it('should handle multiple subscribers for the same event', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    dispatcher.on('multi-event', callback1);
    dispatcher.on('multi-event', callback2);

    dispatcher.dispatch('multi-event', 42);

    expect(callback1).toHaveBeenCalledWith(42);
    expect(callback2).toHaveBeenCalledWith(42);

    dispatcher.off('multi-event');
  });

  it('should subscribe once and only trigger once', () => {
    const callback = vi.fn();
    dispatcher.once('once-event', callback);

    dispatcher.dispatch('once-event', 'first');
    dispatcher.dispatch('once-event', 'second');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');
  });

  it('should unsubscribe using off for a single event string', () => {
    const callback = vi.fn();
    dispatcher.on('off-event', callback);
    dispatcher.off('off-event');

    dispatcher.dispatch('off-event', 'data');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should unsubscribe using off for an array of event strings', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    dispatcher.on('event1', callback1);
    dispatcher.on('event2', callback2);

    dispatcher.off(['event1', 'event2']);

    dispatcher.dispatch('event1', 'data1');
    dispatcher.dispatch('event2', 'data2');

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  it('should gracefully handle non-function callbacks when subscribing', () => {
    expect(() => {
      // @ts-expect-error - testing invalid callback type runtime safety
      dispatcher.on('invalid-event', 'not-a-function');
    }).not.toThrow();

    expect(() => {
      dispatcher.dispatch('invalid-event', 'data');
    }).not.toThrow();
  });

  it('should clear once event subscription if off is called', () => {
    const callback = vi.fn();
    dispatcher.once('once-off-event', callback);
    dispatcher.off('once-off-event');

    dispatcher.dispatch('once-off-event', 'data');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should support mixed on and once subscribers for the same event name', () => {
    const callbackOn = vi.fn();
    const callbackOnce = vi.fn();

    dispatcher.on('mixed-event', callbackOn);
    dispatcher.once('mixed-event', callbackOnce);

    dispatcher.dispatch('mixed-event', 'first');
    expect(callbackOn).toHaveBeenCalledTimes(1);
    expect(callbackOn).toHaveBeenCalledWith('first');
    expect(callbackOnce).toHaveBeenCalledTimes(1);
    expect(callbackOnce).toHaveBeenCalledWith('first');

    dispatcher.dispatch('mixed-event', 'second');
    expect(callbackOn).toHaveBeenCalledTimes(2);
    expect(callbackOn).toHaveBeenLastCalledWith('second');
    expect(callbackOnce).toHaveBeenCalledTimes(1); // remain 1

    dispatcher.off('mixed-event');
  });
});
