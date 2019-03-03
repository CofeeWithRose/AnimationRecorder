var RecordError = (function () {
    function RecordError(name, message) {
        this.name = name;
        this.message = message;
    }
    return RecordError;
}());
export { RecordError };
export var RecordErrorName;
(function (RecordErrorName) {
    RecordErrorName["NOT_SUPPORT_ERROR"] = "NOT_SUPPORT_ERROR";
})(RecordErrorName || (RecordErrorName = {}));
export var RecordErrorMessage;
(function (RecordErrorMessage) {
    RecordErrorMessage["NOT_SUPPORT_ERROR"] = "your browser is not support record.";
})(RecordErrorMessage || (RecordErrorMessage = {}));
var RecordEvent = (function () {
    function RecordEvent(eventName, data) {
        this.eventName = eventName;
        this.data = data;
    }
    return RecordEvent;
}());
export { RecordEvent };
//# sourceMappingURL=RecorderInterface.js.map