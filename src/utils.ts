
export function uuid() {
  let result, i, j;
  result = '';
  for(j=0; j<32; j++) {
    if( j == 8 || j == 12 || j == 16 || j == 20)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
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
}
