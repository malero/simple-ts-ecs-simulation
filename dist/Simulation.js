"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
var simple_ts_event_dispatcher_1 = require("simple-ts-event-dispatcher");
var ESimulationEventType_1 = require("./ESimulationEventType");
var Frame_1 = require("./Frame");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var SimulationEventDefinition_1 = require("./SimulationEventDefinition");
var Simulation = /** @class */ (function (_super) {
    __extends(Simulation, _super);
    function Simulation(keyFrame, frame, authority) {
        if (keyFrame === void 0) { keyFrame = 0; }
        if (frame === void 0) { frame = 0; }
        if (authority === void 0) { authority = false; }
        var _this = _super.call(this) || this;
        _this.authority = authority;
        _this._keyFrame = 0;
        _this._frame = -1;
        _this.currentFrame = null;
        _this.frameHashMap = {};
        _this.queuedEvents = [];
        _this.offset = 0;
        _this._keyFrame = keyFrame;
        _this._frame = frame;
        _this._entities = {};
        _this.systems = [];
        _this._timeLast = new Date().getTime();
        _this.tick();
        return _this;
    }
    Simulation.prototype.addSystem = function (system) {
        this.systems.push(system);
    };
    Simulation.prototype.addEntity = function (entity) {
        if (!this._entities[entity.uid]) {
            this._entities[entity.uid] = entity;
            this.trigger('entityAdded', entity);
        }
    };
    Simulation.prototype.getEntity = function (uid) {
        return this._entities[uid];
    };
    Simulation.prototype.removeEntity = function (entity) {
        if (this._entities[entity.uid]) {
            delete this._entities[entity.uid];
            this.trigger('entityRemoved', entity);
        }
    };
    Object.defineProperty(Simulation.prototype, "entities", {
        get: function () {
            var entities = [];
            for (var uid in this._entities) {
                entities.push(this._entities[uid]);
            }
            return entities;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Simulation.prototype, "entityIds", {
        get: function () {
            var ids = [];
            for (var uid in this._entities) {
                ids.push(uid);
            }
            return ids;
        },
        enumerable: false,
        configurable: true
    });
    Simulation.prototype.tick = function () {
        var now = (new Date()).getTime();
        var nextFrame = this.getNextFrame();
        this._frame = nextFrame.frame;
        this._keyFrame = nextFrame.keyFrame;
        var isKeyframe = nextFrame.isKeyFrame;
        this.currentFrame = this.getFrame(this._keyFrame, this._frame, true);
        if (nextFrame.isKeyFrame)
            this.trigger('keyFrame', this.keyFrame);
        else
            this.trigger('frame', this.frame);
        for (var i = this.queuedEvents.length - 1; i >= 0; i--) {
            var e = this.queuedEvents[i];
            if (e.keyFrame === this.currentFrame.keyFrame && e.frame === this.currentFrame.frame) {
                this.currentFrame.addEvent(e);
                this.queuedEvents.splice(i, 1);
            }
        }
        for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
            var system = _a[_i];
            system.tickFrame(this.currentFrame, this);
            for (var entityId in this._entities) {
                var entity = this._entities[entityId];
                system.tickEntity(this.currentFrame, this, entity);
            }
        }
        if (isKeyframe) {
            for (var entityId in this._entities) {
                var entity = this._entities[entityId];
                this.currentFrame.addSnapshot(entityId, entity.getSnapshot());
            }
        }
        var postExecuteTime = (new Date()).getTime();
        var frameTime = postExecuteTime - now;
        var offsetSign = Math.sign(this.offset);
        var offset = Math.abs(this.offset) > Simulation.FrameTime ? Simulation.FrameTime * offsetSign : this.offset;
        var tickQueue = Simulation.FrameTime - frameTime + offset;
        this.offset -= offset;
        this._timeLast = now;
        if (tickQueue <= 0) { // behind simulation authority
            this.tick();
        }
        else { // ahead or on time
            this.tickTimeout = setTimeout(this.tick.bind(this), tickQueue);
        }
    };
    Simulation.prototype.replayEntityFromKeyframe = function (keyFrame, entityId, force) {
        if (force === void 0) { force = false; }
        if (!keyFrame || !entityId) {
            return;
        }
        var frame = this.getFrame(keyFrame, 0, true);
        var entity = this._entities[entityId];
        var snapshot = frame.getSnapshot(entityId);
        if (entity && snapshot)
            entity.setSnapshot(snapshot);
        else if (!force)
            return false; // Can't replay if we don't have a snapshot
        var numFrames = this.getFrameDifference(this._keyFrame, this._frame, keyFrame, 0);
        var index = this.getFrameIndex(frame.keyFrame, frame.frame);
        var lastIndex = index + (numFrames || 0);
        for (var i = index; i <= lastIndex; i++) {
            var _frame = this.getFrame(Math.floor(i / Simulation.KeyFrameEvery), i % Simulation.KeyFrameEvery, true);
            for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
                var system = _a[_i];
                system.tickReplay(_frame, this, entityId);
                if (entity)
                    system.tickEntity(frame, this, entity);
            }
        }
    };
    Simulation.prototype.getNextFrame = function () {
        if (this._frame + 1 >= Simulation.KeyFrameEvery) {
            return {
                frame: 0,
                keyFrame: this._keyFrame + 1,
                isKeyFrame: true
            };
        }
        else {
            return {
                frame: this._frame + 1,
                keyFrame: this._keyFrame,
                isKeyFrame: false
            };
        }
    };
    Simulation.prototype.addOffset = function (offset) {
        this.offset += offset;
    };
    Simulation.prototype.frameAdvance = function (frames) {
        if (frames === void 0) { frames = 1; }
        var kfs = Math.floor(frames / Simulation.KeyFrameEvery);
        return {
            keyFrame: this._keyFrame + kfs,
            frame: this._frame + frames - 10 * kfs
        };
    };
    Simulation.prototype.createEvent = function (bundle) {
        var uid = (0, utils_1.uuid)();
        var nextFrame = this.getNextFrame();
        bundle.keyFrame = nextFrame.keyFrame;
        bundle.frame = nextFrame.frame; // Process event on next frame
        bundle.action = constants_1.EEventAction.CREATE;
        if (this.authority) {
            bundle['server_uid'] = uid;
        }
        else {
            bundle['client_uid'] = uid;
        }
        this.trigger("event", bundle);
        this.addEventToFrame(bundle);
    };
    Simulation.prototype.addExternalEvent = function (bundle) {
        if (this.authority) {
            try {
                bundle.data = SimulationEventDefinition_1.SimulationEventDefinition.clean(bundle.type, bundle.data);
            }
            catch (e) {
                console.log('bad data', bundle);
                return;
            }
            bundle.data.entity_id = bundle.socket_id;
            bundle["server_uid"] = (0, utils_1.uuid)();
            if (Simulation.EchoedEvents.indexOf(bundle.type) > -1) {
                bundle['authority'] = constants_1.EAuthority.SERVER;
                bundle['action'] = constants_1.EEventAction.ECHO;
                this.trigger("event", bundle);
            }
        }
        this.addEventToFrame(bundle);
    };
    Simulation.prototype.addEventToFrame = function (bundle) {
        var frame = this.getFrame(bundle.keyFrame, bundle.frame, true);
        var frameDiff = this.getFrameDifference(this._keyFrame, this._frame, bundle.keyFrame, bundle.frame);
        if (this.authority && frameDiff !== null && frameDiff > Simulation.KeyFrameEvery * 3) {
            console.log('invalidating event', bundle);
            this.invalidateEvent(bundle);
            return;
        }
        frame.addEvent(bundle);
        if (frameDiff === null || frameDiff > -1) {
            this.replayEntityFromKeyframe(bundle.keyFrame - 1, bundle.data.entity_id, bundle.type === ESimulationEventType_1.ESimulationEventType.CREATE_ENTITY);
        }
    };
    Simulation.prototype.invalidateEvent = function (bundle) {
        bundle.action = constants_1.EEventAction.PURGE;
        this.trigger('event', bundle);
    };
    Simulation.prototype.getFrameIndex = function (keyFrame, frame) {
        return keyFrame * Simulation.KeyFrameEvery + frame;
    };
    Simulation.prototype.getFrame = function (keyFrame, frame, create) {
        if (create === void 0) { create = false; }
        var hash = this.getFrameHash(keyFrame, frame);
        var _frame = this.frameHashMap[hash];
        if (create && !_frame) {
            this.frameHashMap[hash] = new Frame_1.Frame(keyFrame, frame);
            return this.frameHashMap[hash];
        }
        else {
            return _frame;
        }
    };
    Simulation.prototype.getFrameHash = function (keyFrame, frame) {
        return keyFrame + "_" + frame;
    };
    Simulation.prototype.getFrameDifference = function (keyFrame0, frame0, keyFrame1, frame1) {
        if (!keyFrame0 || !keyFrame1)
            return null;
        var frame1Index = this.getFrameIndex(keyFrame0, frame0);
        var frame2Index = this.getFrameIndex(keyFrame1, frame1);
        return frame1Index - frame2Index;
    };
    Object.defineProperty(Simulation.prototype, "keyFrame", {
        get: function () {
            return this._keyFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Simulation.prototype, "frame", {
        get: function () {
            return this._frame;
        },
        enumerable: false,
        configurable: true
    });
    Simulation.prototype.getEntitiesByType = function (type) {
        var entities = [];
        for (var uid in this._entities) {
            if (this._entities[uid] instanceof type)
                entities.push(this._entities[uid]);
        }
        return entities;
    };
    Simulation.EchoedEvents = [
        ESimulationEventType_1.ESimulationEventType.INPUT,
    ];
    Simulation.FrameTime = 50;
    Simulation.KeyFrameEvery = 500 / Simulation.FrameTime;
    return Simulation;
}(simple_ts_event_dispatcher_1.EventDispatcher));
exports.Simulation = Simulation;
//# sourceMappingURL=Simulation.js.map