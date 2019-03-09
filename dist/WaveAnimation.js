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
var WaveAnimInfo = (function () {
    function WaveAnimInfo(offsetX, color) {
        this.offesetX = offsetX || 0;
        this.color = color || 'black';
    }
    return WaveAnimInfo;
}());
export { WaveAnimInfo };
var WaveAnimation = (function () {
    function WaveAnimation(container, config) {
        var _this = this;
        this.waveInfoArray = new Array();
        this.isRunning = false;
        this.MIN_VOLUM = 0.08;
        this.volum = this.MIN_VOLUM;
        this.lastVolum = this.MIN_VOLUM;
        this.volumAutoScale = 1;
        this.maxInputVolum = 0;
        this.setCanvasSize = function () {
            var containerStyleInfo = getComputedStyle(_this.container);
            _this.width = _this.canvas.width = parseFloat(containerStyleInfo.width);
            _this.height = _this.canvas.height = parseFloat(containerStyleInfo.height);
        };
        this._tempRun = function () {
            _this.beforeRender();
            _this.context.clearRect(0, 0, _this.width, _this.height);
            var fixedVolum = _this.lastVolum + (_this.volum - _this.lastVolum) * 0.1;
            for (var i = 0; i < _this.waveInfoArray.length; i++) {
                var waveInfo = _this.waveInfoArray[i];
                _this.paintWave(waveInfo.offesetX, waveInfo.color, (i + 1) / _this.waveInfoArray.length, fixedVolum);
                waveInfo.offesetX += Math.PI * (0.05 + 0.05 * fixedVolum);
            }
            _this.lastVolum = fixedVolum;
            requestAnimationFrame(_this.run);
        };
        this.run = function () {
        };
        this.beforeRender = function () {
        };
        this.config = __assign({ lineWidth: 2, waveCount: 3, colors: [
                'rgba(255,152,152, 0.2)',
                'rgba(255,152,152, 0.5)',
                'rgba(255,152,152, 1)',
            ] }, config);
        this.initCanvas(container);
        this.initWaveInfo(this.config);
        this.start();
        this.stop();
    }
    Object.defineProperty(WaveAnimation.prototype, "Volum", {
        get: function () {
            return this.volum;
        },
        set: function (volum) {
            this.volum = Math.max(this.MIN_VOLUM, Math.min(this.volumAutoScale * volum + this.MIN_VOLUM, 1));
            if (volum > this.maxInputVolum) {
                this.maxInputVolum = volum;
                this.volumAutoScale = 1 / this.maxInputVolum;
            }
        },
        enumerable: true,
        configurable: true
    });
    WaveAnimation.prototype.initCanvas = function (container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasSize();
        container.appendChild(this.canvas);
        window.addEventListener('resize', this.setCanvasSize);
    };
    WaveAnimation.prototype.initWaveInfo = function (config) {
        for (var i = 0; i < config.waveCount; i++) {
            this.waveInfoArray.push(new WaveAnimInfo(i * Math.PI * 0.5, this.config.colors[i % this.config.colors.length]));
        }
    };
    WaveAnimation.prototype.start = function () {
        if (!this.isRunning) {
            this.run = this._tempRun;
            this.run();
            this.isRunning = true;
        }
    };
    WaveAnimation.prototype.stop = function () {
        if (this.isRunning) {
            this.run = function () { };
            this.isRunning = false;
        }
    };
    ;
    WaveAnimation.prototype.destroy = function () {
        window.removeEventListener('resize', this.setCanvasSize);
    };
    WaveAnimation.prototype.paintWave = function (offsetX, color, amplitudeScale, volum) {
        this.context.strokeStyle = color || 'black';
        this.context.lineWidth = this.config.lineWidth;
        var halfHeight = this.height * 0.5;
        this.context.beginPath();
        this.context.moveTo(0, halfHeight);
        for (var x = 0; x < this.width; x += 2) {
            var proportionX = x / this.width;
            var theta = 2 * Math.PI * proportionX * 3;
            var scaleY = 0.5 * Math.sin(Math.PI * proportionX);
            this.context.lineTo(x, halfHeight * amplitudeScale * volum * scaleY * Math.sin(theta + offsetX) + halfHeight);
        }
        this.context.stroke();
    };
    return WaveAnimation;
}());
export { WaveAnimation };
//# sourceMappingURL=WaveAnimation.js.map