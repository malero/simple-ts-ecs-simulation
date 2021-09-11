"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
var utils_1 = require("../utils");
var Entity = /** @class */ (function () {
    function Entity(uid, entityType) {
        this.entityType = null;
        this.components = [];
        this.uid = uid;
        this.entityType = entityType;
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
    Entity.register = function (name, setup) {
        if (setup === void 0) { setup = null; }
        return function (target, _key) {
            if (_key === void 0) { _key = null; }
            Entity.entityRegistry[name] = target;
        };
    };
    Entity.constructEntity = function (name, uid) {
        if (uid === void 0) { uid = null; }
        if (uid === null)
            uid = (0, utils_1.uuid)();
        var cls = Entity.entityRegistry[name];
        return new cls(uid, name);
    };
    Entity.entityRegistry = {};
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map