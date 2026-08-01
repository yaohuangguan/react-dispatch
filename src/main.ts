const dispatcher = (() => {
  const events = new Map<string, Array<(data: any) => any>>();
  const onceEvents = new Map<string, Array<(data: any) => any>>();
  let isOnce = false;

  const checkValidate = (checkTarget: unknown, target: string): boolean =>
    Object.prototype.toString.call(checkTarget) === target;
  
  const beforeSubscribe = (processor: string, updater: (data: any) => any, isOnceEvt: boolean) => {
    if (!isOnceEvt) {
      if (!events.has(processor)) events.set(processor, []);
      if (!checkValidate(updater, "[object Function]")) return;
      return events.get(processor)!.push(updater);
    }
    if (!onceEvents.has(processor)) onceEvents.set(processor, []);
    if (!checkValidate(updater, "[object Function]")) return;
    onceEvents.get(processor)!.push(updater);
  };

  const dispatch = <T = any>(event: string, data?: T): void => {
    if (isOnce && onceEvents.has(event)) {
      onceEvents.get(event)!.forEach((callback) => callback(data));
      onceEvents.delete(event);
    }
    if (!events.has(event)) return;
    events.get(event)!.forEach((callback) => callback(data));
  };

  const on = <T = any>(event: string, callback: (data: T) => unknown): void => {
    beforeSubscribe(event, callback, false);
  };

  const once = <T = any>(event: string, callback: (data: T) => unknown): void => {
    beforeSubscribe(event, callback, true);
    isOnce = true;
  };

  const off = (event: string | string[]): boolean | void => {
    if (Array.isArray(event)) {
      return event.forEach((e: string) => {
        if (events.has(e)) {
          events.delete(e);
        } else {
          onceEvents.delete(e);
        }
      });
    }
    return events.has(event) ? events.delete(event) : onceEvents.delete(event);
  };

  return {
    dispatch,
    on,
    once,
    off,
  };
})();

export { dispatcher }