var AnimationRecordEvent = (function () {
    function AnimationRecordEvent() {
    }
    return AnimationRecordEvent;
}());
export { AnimationRecordEvent };
export var AnimationRecordErrorName;
(function (AnimationRecordErrorName) {
    AnimationRecordErrorName["NOT_SUPPORT_ERROR"] = "NOT_SUPPORT_ERROR";
})(AnimationRecordErrorName || (AnimationRecordErrorName = {}));
var AnimationRecordError = (function () {
    function AnimationRecordError(name, message) {
        this.name = name;
        this.message = message;
    }
    return AnimationRecordError;
}());
export { AnimationRecordError };
//# sourceMappingURL=index.js.map