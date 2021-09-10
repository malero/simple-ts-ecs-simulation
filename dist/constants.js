"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EEventAction = exports.EAuthority = void 0;
var EAuthority;
(function (EAuthority) {
    EAuthority[EAuthority["CLIENT"] = 0] = "CLIENT";
    EAuthority[EAuthority["SERVER"] = 1] = "SERVER";
})(EAuthority = exports.EAuthority || (exports.EAuthority = {}));
var EEventAction;
(function (EEventAction) {
    EEventAction[EEventAction["CREATE"] = 0] = "CREATE";
    EEventAction[EEventAction["ECHO"] = 1] = "ECHO";
    EEventAction[EEventAction["PURGE"] = 2] = "PURGE";
    EEventAction[EEventAction["CONFIRM"] = 3] = "CONFIRM";
})(EEventAction = exports.EEventAction || (exports.EEventAction = {}));
//# sourceMappingURL=constants.js.map