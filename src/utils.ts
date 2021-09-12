export function uuid() {
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}

export class Vector2D {
    constructor(
        public x: number,
        public y: number
    ) {
    }

    public vectorBetween(vector: Vector2D): Vector2D {
        return new Vector2D(vector.x - this.x, vector.y - this.y);
    }

    public dot(vector: Vector2D): number {
        return this.x * vector.x + this.y * vector.y;
    }

    public cross(vector: Vector2D): number {
        return this.x * vector.x - this.y * vector.y;
    }

    public magnitude(): number {
        return Math.sqrt(this.dot(this));
    }

    public divide(scalar: number): Vector2D {
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    public normalize() {
        return this.divide(this.magnitude());
    }

    public get length(): number {
        return this.distance(new Vector2D(0, 0));
    }

    public distance(vector: Vector2D): number {
        return Math.abs(Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2));
    }

    get radians() {
        return Math.atan2(this.y, this.x);
    }

    get rotation() {
        const degrees = 180 * this.radians / Math.PI;
        return (360 + Math.round(degrees)) % 360;
    }

}
