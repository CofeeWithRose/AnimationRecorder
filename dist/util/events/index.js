import { MutiMap } from "../Map/index";
var EventEmitter = (function () {
    function EventEmitter() {
        this.eventMap = new MutiMap();
    }
    EventEmitter.prototype.addListener = function (eventName, listener) {
        this.eventMap.add(eventName, listener);
    };
    EventEmitter.prototype.removeListener = function (eventName, listener) {
        this.eventMap.deleteItem(eventName, listener);
    };
    EventEmitter.prototype.emit = function (eventName) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var listeners = this.eventMap.get(eventName);
        for (var i = 0; i < listeners.length; i++) {
            try {
                listeners[i].apply(listeners, params);
            }
            catch (error) {
                console.error(error);
            }
        }
    };
    return EventEmitter;
}());
export { EventEmitter };
//# sourceMappingURL=index.js.map