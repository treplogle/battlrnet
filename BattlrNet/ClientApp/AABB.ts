import Vector from "./Vector";
import IPoint from "./IPoint";

export default class AABB {
    constructor(public center: Vector, public halfSize: Vector) {

    }

    public overlaps(other: AABB) {
        if (Math.abs(this.center.x - other.center.x) > this.halfSize.x + other.halfSize.x) return false;
        if (Math.abs(this.center.y - other.center.y) > this.halfSize.y + other.halfSize.y) return false;
        return true;
    }

    public getSize(): IPoint {
        return {
            x: this.halfSize.x * 2,
            y: this.halfSize.y * 2
        };
    }
}