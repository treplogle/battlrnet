import Vector from "./Vector";
import Engine from "./Engine";

class App {
    public canvas: HTMLCanvasElement;
    public engine: Engine;

    constructor(canvasID: string) {
        this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
        this.engine = new Engine(this.canvas);
    }
}

export default new App("game");