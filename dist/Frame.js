"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = void 0;
var Frame = /** @class */ (function () {
    function Frame(keyFrame, frame) {
        this.keyFrame = keyFrame;
        this.frame = frame;
        this.snapshots = {};
        this.events = [];
    }
    Object.defineProperty(Frame.prototype, "isKeyFrame", {
        get: function () {
            return this.frame === 0;
        },
        enumerable: false,
        configurable: true
    });
    Frame.prototype.addEvent = function (bundle) {
        this.events.push(bundle);
    };
    Frame.prototype.addSnapshot = function (entityId, snapshot) {
        this.snapshots[entityId] = snapshot;
    };
    Frame.prototype.updateSnapshot = function (entityId, data) {
        var snapshot = this.snapshots[entityId];
        if (snapshot) {
            for (var key in data) {
                snapshot[key] = data[key];
            }
        }
        else {
            console.log('snapshot not found');
        }
    };
    Frame.prototype.getSnapshot = function (entityId) {
        return this.snapshots[entityId];
    };
    Frame.prototype.getEventsFor = function (uid, type) {
        var events = [];
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var e = _a[_i];
            //console.log('finding events', e.type, '===', type, e.data.entity_id, '===', uid);
            if (e.type === type && e.data.entity_id === uid)
                events.push(e);
        }
        return events;
    };
    return Frame;
}());
exports.Frame = Frame;
//# sourceMappingURL=Frame.js.map