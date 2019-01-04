import IPoint from "./IPoint";

export default class Vector implements IPoint {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /** Modifies this vector */
    public copyFrom(other: Vector) {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    /** Modifies this vector */
    public add(other: Vector) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /** Modifies this vector */
    public subtract(other: Vector) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /** Modifies this vector */
    public multiply(value: number) {
        this.x *= value;
        this.y *= value;
        return this;
    }

    /** Modifies this vector */
    public round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    public clone() {
        return new Vector(this.x, this.y);
    }

    public dot(other: Vector) {
        return this.x * other.x + this.y * other.y;
    }

    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    public distance(other: Vector) {
        const x = this.x - other.x;
        const y = this.y - other.y;
        return Math.sqrt(x * x + y * y);
    }

    public distanceSquared(other: Vector) {
        const x = this.x - other.x;
        const y = this.y - other.y;
        return x * x + y * y;
    }

    static add(a: Vector, b: Vector, out?: Vector): Vector {
        if (!out) out = new Vector();
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }

    static subtract(a: Vector, b: Vector, out?: Vector): Vector {
        if (!out) out = new Vector();
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    static multiply(a: Vector, value: number, out?: Vector): Vector {
        if (!out) out = new Vector();
        out.x = a.x * value;
        out.y = a.y * value;
        return out;
    }

    static dot(a: Vector, b: Vector) {
        return a.dot(b);
    }

    static lerp(a: Vector, b: Vector, t: number, out?: Vector): Vector {
        if (!out) out = new Vector();
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        return out;
    }

    static clone(source: Vector, out?: Vector): Vector {
        if (out) {
            out.copyFrom(source);
            return out;
        }

        return new Vector(source.x, source.y);
    }

    static fromPoint(pt: IPoint, out?: Vector) {
        if (!out) out = new Vector();
        out.x = pt.x;
        out.y = pt.y;
        return out;
    }

    static round(source: Vector, out?: Vector): Vector {
        if (!out) out = new Vector();
        out.x = Math.round(source.x);
        out.y = Math.round(source.y);
        return out;
    }

    static readonly zero = new Vector(0, 0);
    static readonly one = new Vector(1, 1);
    static readonly right = new Vector(1, 0);
    static readonly left = new Vector(-1, 0);
    static readonly up = new Vector(0, -1);
    static readonly down = new Vector(0, 1);
}