"use strict";
var dispatcher = (function () {
    var events = new Map();
    var onceEvents = new Map();
    var isOnce = false;
    var checkValidate = function (checkTarget, target) {
        return Object.prototype.toString.call(checkTarget) === target;
    };
    var beforeSubscribe = function (processor, updater, isSubscribe) {
        if (isSubscribe) {
            if (!events.has(processor))
                events.set(processor, []);
            if (!checkValidate(updater, "[object Function]"))
                return;
            return events.get(processor).push(updater);
        }
        if (!onceEvents.has(processor))
            onceEvents.set(processor, []);
        if (!checkValidate(updater, "[object Function]"))
            return;
        onceEvents.get(processor).push(updater);
    };
    var dispatch = function (event, data) {
        if (isOnce && onceEvents.has(event)) {
            onceEvents.get(event).forEach(function (callback) { return callback(data); });
            onceEvents.delete(event);
        }
        if (!events.has(event))
            return;
        events.get(event).forEach(function (callback) { return callback(data); });
    };
    var on = function (event, callback) {
        beforeSubscribe(event, callback, true);
    };
    var once = function (event, callback) {
        beforeSubscribe(event, callback, false);
        isOnce = true;
    };
    var off = function (event) {
        if (checkValidate(event, "[object Array]")) {
            return event.forEach(function (e) {
                if (events.has(e)) {
                    events.delete(e);
                }
                else {
                    onceEvents.delete(e);
                }
            });
        }
        return events.has(event) ? events.delete(event) : onceEvents.delete(event);
    };
    return {
        dispatch: dispatch,
        on: on,
        once: once,
        off: off,
    };
})();
module.exports.dispatcher = dispatcher;
