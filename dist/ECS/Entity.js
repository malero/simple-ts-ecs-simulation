"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
var Entity = /** @class */ (function () {
    function Entity(uid) {
        this.components = [];
        this.uid = uid;
    }
    Entity.prototype.addComponent = function (component) {
        this.components.push(component);
    };
    Entity.prototype.getComponent = function (type) {
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c instanceof type)
                return c;
        }
        return null;
    };
    Entity.prototype.getSnapshot = function () {
        var snapshot = {};
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var c = _a[_i];
            var data = c.getData();
            for (var key in data) {
                snapshot[key] = data[key];
            }
        }
        return snapshot;
    };
    Entity.prototype.setSnapshot = function (snapshot) {
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var c = _a[_i];
            c.setData(snapshot);
        }
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map