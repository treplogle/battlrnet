export default class Color {

    get r() { return this._r; }
    set r(value) { this._r = value; this.updateCss(); }

    get g() { return this._g; }
    set g(value) { this._g = value; this.updateCss(); }

    get b() { return this._b; }
    set b(value) { this._b = value; this.updateCss(); }

    private _css: string = "rgb(0,0,0)";
    get css() { return this._css; }

    constructor(private _r: number = 0, private _g: number = 0, private _b: number = 0) {
        this.updateCss();
    }

    set(r: number = 0, g: number = 0, b: number = 0) {
        this._r = r;
        this._g = g;
        this._b = b;

        this.updateCss();
    }

    private updateCss() {
        this._css = `rgb(${this._r},${this._g},${this._b})`;
    }
}
