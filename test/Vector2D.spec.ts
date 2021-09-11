import {Vector2D} from "../src";


describe('Vector2D', () => {

    it("should calculate distance correctly", () => {
        let v1 = new Vector2D(1, 1);
        let v2 = new Vector2D(4,5);
        expect(v1.distance(v2)).toBe(5);

        v1 = new Vector2D(0, 0);
        v2 = new Vector2D(3,4);
        expect(v1.distance(v2)).toBe(5);

        v1 = new Vector2D(3, 4);
        expect(v1.length).toBe(5);
    });
});
