var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { WaveAnimation } from "./WaveAnimation";
import { Recorder } from "./Recorder";
var AnimationRecorder = (function () {
    function AnimationRecorder() {
        this.recorder = new Recorder();
    }
    AnimationRecorder.prototype.init = function (config, containerElement) {
        var _this = this;
        this.config = config || {};
        this.recorder.init(config);
        if (containerElement) {
            this.animation = new WaveAnimation(containerElement, this.config.waveAnimationConfig);
            this.recorder.addEventListener('audioprocess', function (event) {
                var sum = 0;
                var data = event.data;
                var step = Math.floor(data.length * 0.01);
                for (var i = 0; i < data.length; i += step) {
                    sum += Math.abs(data[i]);
                }
                _this.animation.Volum = sum * 0.01;
            });
            this.start = function () { return __awaiter(_this, void 0, void 0, function () {
                var promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.tempStart()];
                        case 1:
                            promise = _a.sent();
                            this.animation.start();
                            return [2, promise];
                    }
                });
            }); };
            this.stop = function () {
                _this.animation.stop();
                return _this.recorder.stop();
            };
            this.destroy = function () {
                _this.animation.destroy();
                _this.recorder.destroy();
            };
        }
        else {
            this.start = this.tempStart;
            this.stop = this.tempStop;
            this.destroy = this.tempDestroy;
        }
    };
    AnimationRecorder.prototype.tempStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.recorder.start()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    AnimationRecorder.prototype.start = function () {
        throw 'Please execute init method before start';
    };
    AnimationRecorder.prototype.tempStop = function () {
        return this.recorder.stop();
    };
    AnimationRecorder.prototype.stop = function () {
        throw 'Please execute init method before stop';
    };
    AnimationRecorder.prototype.addEventListener = function (animationRecordEventName, listener) {
        this.recorder.addEventListener(animationRecordEventName, listener);
    };
    ;
    AnimationRecorder.prototype.removeEventListener = function (animationRecordEventName, listener) {
        this.recorder.removeEventListener(animationRecordEventName, listener);
    };
    ;
    AnimationRecorder.prototype.throwRecordError = function (animationRecordError) {
        this.recorder.throwRecordError(animationRecordError);
    };
    ;
    AnimationRecorder.prototype.tempDestroy = function () {
        this.recorder.destroy();
    };
    AnimationRecorder.prototype.destroy = function () {
    };
    return AnimationRecorder;
}());
export { AnimationRecorder };
//# sourceMappingURL=index.js.map