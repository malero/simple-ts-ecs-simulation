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
    Vector2D.prototype.vectorBetween = function (vector) {
        return new Vector2D(vector.x - this.x, vector.y - this.y);
    };
    Vector2D.prototype.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y;
    };
    Vector2D.prototype.cross = function (vector) {
        return this.x * vector.x - this.y * vector.y;
    };
    Vector2D.prototype.magnitude = function () {
        return Math.sqrt(this.dot(this));
    };
    Vector2D.prototype.divide = function (scalar) {
        return new Vector2D(this.x / scalar, this.y / scalar);
    };
    Vector2D.prototype.normalize = function () {
        return this.divide(this.magnitude());
    };
    Object.defineProperty(Vector2D.prototype, "length", {
        get: function () {
            return this.distance(new Vector2D(0, 0));
        },
        enumerable: false,
        configurable: true
    });
    Vector2D.prototype.distance = function (vector) {
        return Math.abs(Math.sqrt(Math.pow((this.x - vector.x), 2) + Math.pow((this.y - vector.y), 2)));
    };
    return Vector2D;
}());
exports.Vector2D = Vector2D;
//# sourceMappingURL=utils.js.map