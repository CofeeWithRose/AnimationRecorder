var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { AnimationRecordError } from "./interface/index";
import { EventEmitter } from "./util/events/index";
import { RecordEvent, RecordErrorName, RecordError, RecordErrorMessage } from "./interface/RecorderInterface";
var Recorder = (function () {
    function Recorder() {
        var _this = this;
        this.eventEmit = new EventEmitter();
        this.recordData = [new Array()];
        this.state = 'suspended';
        this.audioprocess = function (audioProcessingEvent) {
            var channelNumber = audioProcessingEvent.inputBuffer.numberOfChannels;
            var res = new Array();
            for (var i = 0; i < channelNumber; i++) {
                var data = audioProcessingEvent.inputBuffer.getChannelData(i);
                res.push(data);
            }
            _this.recordData.push(res);
            _this.eventEmit.emit('audioprocess', new RecordEvent('audioprocess', res));
        };
    }
    Recorder.prototype.init = function (config) {
        this.config = __assign({ bufferSize: 4096, numChannels: 2, mimeType: 'audio/wav' }, config);
    };
    Recorder.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.config) {
                    throw 'Please execute init method before start.';
                }
                else {
                    this.start = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, bufferSize, numChannels, _b, error_1;
                        var _this = this;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!('suspended' === this.state)) return [3, 4];
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    this.audioContext = this.audioContext || this.createAudioContext();
                                    this.audioContext.onstatechange = function (event) {
                                        _this.state = event.target.state;
                                        _this.eventEmit.emit('statechange', new RecordEvent('statechange', _this.state));
                                    };
                                    _a = this.config, bufferSize = _a.bufferSize, numChannels = _a.numChannels;
                                    this.analyserNode = this.audioContext.createAnalyser();
                                    this.scriptProcessorNode = this.audioContext.createScriptProcessor(bufferSize, numChannels, numChannels);
                                    this.scriptProcessorNode.addEventListener('audioprocess', this.audioprocess);
                                    _b = this;
                                    return [4, this.getUserMedia({ audio: true })];
                                case 2:
                                    _b.mediaStream = _c.sent();
                                    this.mediaStreamAudioSourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
                                    this.mediaStreamAudioSourceNode.connect(this.analyserNode);
                                    this.analyserNode.connect(this.scriptProcessorNode);
                                    this.scriptProcessorNode.connect(this.audioContext.destination);
                                    this.audioContext.resume();
                                    return [3, 4];
                                case 3:
                                    error_1 = _c.sent();
                                    this.throwRecordError(error_1);
                                    return [3, 4];
                                case 4: return [2];
                            }
                        });
                    }); };
                    return [2, this.start()];
                }
                return [2];
            });
        });
    };
    Recorder.prototype.createAudioContext = function () {
        if (window.AudioContext) {
            return new AudioContext();
        }
        else if (window.webkitAudioContext) {
            return new webkitAudioContext();
        }
        else {
            throw new RecordError(RecordErrorName.NOT_SUPPORT_ERROR, RecordErrorMessage.NOT_SUPPORT_ERROR);
        }
    };
    Recorder.prototype.stop = function () {
        if ('running' === this.state) {
            this.mediaStream.getAudioTracks().forEach(function (track) { return track.stop(); });
            this.scriptProcessorNode.disconnect();
            this.mediaStreamAudioSourceNode.disconnect();
            this.audioContext.suspend();
            this.scriptProcessorNode = null;
            this.mediaStreamAudioSourceNode = null;
        }
    };
    Recorder.prototype.exportAudio = function () {
        var waveBlob = this.encodeWave();
        this.recordData = [new Array()];
        return waveBlob;
    };
    Recorder.prototype.addEventListener = function (animationRecordEventName, callback) {
        this.eventEmit.addListener(animationRecordEventName, callback);
    };
    ;
    Recorder.prototype.removeEventListener = function (animationRecordEventName, callback) {
        this.eventEmit.removeListener(animationRecordEventName, callback);
    };
    ;
    Recorder.prototype.getFloatTimeDomainData = function (array) {
        try {
            if (this.analyserNode) {
                this.analyserNode.getByteFrequencyData(array);
                return true;
            }
        }
        catch (e) {
            this.throwRecordError(e);
        }
    };
    Recorder.prototype.throwRecordError = function (error) {
        this.eventEmit.emit('error', error);
        console.error(error);
    };
    Recorder.prototype.encodeWave = function () {
        var dataByteLength = this.recordData.length * 16 / 8;
        var arrayBuffer = new ArrayBuffer(44 + dataByteLength);
        var dataView = new DataView(arrayBuffer);
        var offset = 0;
        offset = this.writeString(dataView, offset, 'RIFF');
        return new Blob([arrayBuffer], { type: this.config.mimeType });
    };
    Recorder.prototype.writeString = function (dataView, offset, content) {
        content = content || '';
        for (var i = 0; i < content.length; i++) {
            dataView.setUint8(offset, content.charCodeAt(i));
            offset++;
        }
        return offset;
    };
    Recorder.prototype.getUserMedia = function (constrians) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(constrians);
        }
        else if (navigator.getUserMedia) {
            return new Promise(function (resolve, reject) {
                navigator.getUserMedia(constrians, resolve, reject);
            });
        }
        else {
            this.throwRecordError(new AnimationRecordError(RecordErrorName.NOT_SUPPORT_ERROR, RecordErrorMessage.NOT_SUPPORT_ERROR));
        }
    };
    Recorder.prototype.destroy = function () {
        this.audioContext.close();
        this.audioContext = null;
        this.eventEmit.emit('destroy', new RecordEvent('destroy', null));
    };
    return Recorder;
}());
export { Recorder };
//# sourceMappingURL=Recorder.js.map