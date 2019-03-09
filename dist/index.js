var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var AnimationRecorder = (function (_super) {
    __extends(AnimationRecorder, _super);
    function AnimationRecorder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.recorder = new Recorder();
        _this.volumArray = new Uint8Array(1024);
        _this.setAnimationController = function (event) {
            var type = event.data;
            console.log('type');
            if ('running' === type) {
                _this.animation.start();
            }
            else {
                _this.animation.stop();
            }
        };
        return _this;
    }
    AnimationRecorder.prototype.init = function (config, containerElement) {
        var _this = this;
        this.config = config || {};
        this.recorder.init(config);
        if (containerElement) {
            this.animation = new WaveAnimation(containerElement, this.config.waveAnimationConfig);
            this.recorder.addEventListener('statechange', this.setAnimationController);
            this.animation.beforeRender = function () {
                if (_this.recorder.getFloatTimeDomainData(_this.volumArray)) {
                    var sum_1 = 0;
                    _this.volumArray.forEach(function (val) {
                        sum_1 += val;
                    });
                    _this.animation.Volum = sum_1 / (1024 * 255);
                }
            };
        }
    };
    AnimationRecorder.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.config) {
                    throw 'Please execute init method before start';
                }
                else {
                    this.start = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, this.recorder.start()];
                                case 1: return [2, _a.sent()];
                            }
                        });
                    }); };
                }
                return [2, this.start()];
            });
        });
    };
    AnimationRecorder.prototype.stop = function () {
        var _this = this;
        if (!this.config) {
            throw 'Please execute init method before stop';
        }
        else {
            this.stop = function () {
                return _this.recorder.stop();
            };
        }
        return this.stop();
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
    AnimationRecorder.prototype.destroy = function () {
        var _this = this;
        if (!this.config) {
            throw 'Please execute init method before destroy';
        }
        else {
            this.destroy = function () {
                _this.recorder.removeEventListener('statechange', _this.setAnimationController);
                return _this.recorder.destroy();
            };
        }
        this.destroy();
    };
    return AnimationRecorder;
}(Recorder));
export { AnimationRecorder };
//# sourceMappingURL=index.js.map