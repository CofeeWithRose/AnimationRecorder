var MutiMap = (function () {
    function MutiMap() {
        this.innerMap = new Map();
    }
    MutiMap.prototype.add = function (key, val) {
        var valSet = this.innerMap.get(key);
        if (!valSet) {
            valSet = new Set();
            this.innerMap.set(key, valSet);
        }
        valSet.add(val);
    };
    MutiMap.prototype.set = function (key, valArray) {
        var valSet = new Set(valArray);
        this.innerMap.set(key, valSet);
    };
    MutiMap.prototype.get = function (key) {
        var valSet = this.innerMap.get(key);
        return valSet ? Array.from(valSet) : [];
    };
    MutiMap.prototype.getAll = function () {
        var allValArray = new Array();
        var vals = this.innerMap.values();
        var iterator;
        do {
            iterator = vals.next();
            var valSet = iterator.value;
            valSet.forEach(function (val) {
                allValArray.push(val);
            });
        } while (!iterator.done);
        return allValArray;
    };
    MutiMap.prototype.delete = function (key) {
        this.innerMap.delete(key);
    };
    MutiMap.prototype.deleteItem = function (key, val) {
        var valSet = this.innerMap.get(key);
        if (valSet) {
            valSet.delete(val);
        }
    };
    MutiMap.prototype.clear = function () {
        this.innerMap = new Map();
    };
    MutiMap.prototype.rowSize = function (key) {
        var array = this.innerMap.get(key);
        return array && array.size || 0;
    };
    MutiMap.prototype.size = function () {
        var size = 0;
        var vals = this.innerMap.values();
        var iterator;
        do {
            iterator = vals.next();
            var valSet = iterator.value;
            size += valSet && valSet.size || 0;
        } while (!iterator.done);
        return size;
    };
    return MutiMap;
}());
export { MutiMap };
//# sourceMappingURL=index.js.map