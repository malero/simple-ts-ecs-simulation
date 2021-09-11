export declare function uuid(): string;
export declare class Vector2D {
    x: number;
    y: number;
    constructor(x: number, y: number);
    vectorBetween(vector: Vector2D): Vector2D;
    dot(vector: Vector2D): number;
    cross(vector: Vector2D): number;
    magnitude(): number;
    divide(scalar: number): Vector2D;
    normalize(): Vector2D;
}
