const dispatcher = (() => {
  const events = new Map();
  const onceEvents = new Map();
  let isOnce = false;
  const checkValidate = (checkTarget: () => {} | [], target: string) =>
    Object.prototype.toString.call(checkTarget) === target;
  
  const beforeSubscribe = (processor: string, updater: () => {}, isSubscribe: boolean) => {
    if (isSubscribe) {
      if (!events.has(processor)) events.set(processor, []);
      if (!checkValidate(updater, "[object Function]")) return;
      return events.get(processor).push(updater);
    }
    if (!onceEvents.has(processor)) onceEvents.set(processor, []);
    if (!checkValidate(updater, "[object Function]")) return;
    onceEvents.get(processor).push(updater);
  };
  const dispatch = (event: string, data: any) => {
    if (isOnce && onceEvents.has(event)) {
      onceEvents.get(event).forEach((callback: (arg0: any) => any) => callback(data));
      onceEvents.delete(event);
    }
    if (!events.has(event)) return;
    events.get(event).forEach((callback: (arg0: any) => any) => callback(data));
  };

  const on = (event: string, callback: any) => {
    beforeSubscribe(event, callback, true);
  };
  const once = (event: string, callback: any) => {
    beforeSubscribe(event, callback, false);
    isOnce = true;
  };
  const off = (event: any) => {
    if (checkValidate(event, "[object Array]")) {
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

module.exports.dispatcher = dispatcher;
