const dispatcher = {
  events: {},
  onceEvents: {},
  isOnce: false,
  checkValidate(func) {
    return Object.prototype.toString.call(func) === "[object Function]";
  },
  dispatch(event, data) {
    if (this.isOnce && this.onceEvents[event]) {
      this.onceEvents[event].forEach((callback) => callback(data));
      delete this.onceEvents[event];
    }
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  },
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    if (!this.checkValidate()) return;
    this.events[event].push(callback);
  },
  once(event, callback) {
    if (!this.onceEvents[event]) this.onceEvents[event] = [];
    if (!this.checkValidate()) return;
    this.onceEvents[event].push(callback);
    this.isOnce = true;
  },
  off(event) {
    return event in this.events
      ? delete this.events[event]
      : delete this.onceEvents[event];
  },
};

module.exports.dispatcher = dispatcher;
