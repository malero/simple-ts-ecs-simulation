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
exports.SimulationEventDefinition = void 0;
var simple_ts_models_1 = require("simple-ts-models");
var SimulationEventDefinition = /** @class */ (function (_super) {
    __extends(SimulationEventDefinition, _super);
    function SimulationEventDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimulationEventDefinition.instantiate = function (t, data) {
        var cls = SimulationEventDefinition.eventRegistry[t];
        if (!cls)
            return null;
        return new cls(data);
    };
    SimulationEventDefinition.clean = function (t, data) {
        var obj = SimulationEventDefinition.instantiate(t, data);
        var errors = obj.validate();
        if (errors.length > 0)
            throw new Error("Failed to validate");
        return obj.getData();
    };
    SimulationEventDefinition.register = function (t, setup) {
        if (setup === void 0) { setup = null; }
        return function (target, _key) {
            if (_key === void 0) { _key = null; }
            SimulationEventDefinition.eventRegistry[t] = target;
        };
    };
    SimulationEventDefinition.eventRegistry = {};
    return SimulationEventDefinition;
}(simple_ts_models_1.Model));
exports.SimulationEventDefinition = SimulationEventDefinition;
//# sourceMappingURL=SimulationEventDefinition.js.map