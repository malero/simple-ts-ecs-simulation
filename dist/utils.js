"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2D = exports.uuid = void 0;
function uuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}
exports.uuid = uuid;
var Vector2D = /** @class */ (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector2D;
}());
exports.Vector2D = Vector2D;
//# sourceMappingURL=utils.js.map