"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = void 0;
var constants_1 = require("./constants");
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
        var existingEvent = null;
        var index;
        for (index = 0; index < this.events.length; index++) {
            var event = this.events[index];
            if (event.client_uid === bundle.client_uid || event.server_uid === bundle.server_uid) {
                existingEvent = event;
                break;
            }
        }
        if (existingEvent) {
            if (bundle.action === constants_1.EEventAction.PURGE) {
                this.events.splice(index, 1);
            }
            else if (bundle.action === constants_1.EEventAction.CONFIRM) {
                existingEvent.server_uid = bundle.server_uid;
                existingEvent.action = constants_1.EEventAction.CONFIRM;
            }
            else if (bundle.action === constants_1.EEventAction.UPDATE) {
                this.events[index] = bundle;
            }
        }
        else {
            this.events.push(bundle);
        }
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