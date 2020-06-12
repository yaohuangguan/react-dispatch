const dispatcher = {
    events: {},
    dispatch(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    },
    subscribe(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    off(event) {
        delete this.events[event];
    },
};


module.exports.dispatcher = dispatcher;