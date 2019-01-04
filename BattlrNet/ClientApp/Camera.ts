import Vector from "./Vector";
import IPoint from "./IPoint";

// Borrowed heavily from: https://github.com/robashton/camera

class Viewport {
    left: number = 0;
    right: number = 0;
    top: number = 0;
    bottom: number = 0;
    width: number = 0;
    height: number = 0;
    scale: Vector = new Vector(1, 1);
}

export default class Camera {
    distance: number;
    position: Vector;
    fieldOfView: number;
    viewport: Viewport;
    aspectRatio: number;

    private _isFollowing: boolean = false;
    private _followTarget: Vector;
    private _followSpeed: number;
    private _followOffset: Vector;

    get isFollowing() { return this._isFollowing; }
    get followTarget() { return this._followTarget; }
    get followSpeed() { return this._followSpeed; }
    get followOffset() { return this._followOffset; }

    constructor(public context: CanvasRenderingContext2D) {
        this.distance = 1000;
        this.position = new Vector(0, 0);
        this.fieldOfView = Math.PI / 4.0;
        this.viewport = new Viewport();

        this.updateViewport();
    }

    updateViewport() {
        this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
        this.viewport.width = this.distance * Math.tan(this.fieldOfView);
        this.viewport.height = this.viewport.width / this.aspectRatio;
        this.viewport.left = this.position.x - (this.viewport.width / 2.0);
        this.viewport.top = this.position.y - (this.viewport.height / 2.0);
        this.viewport.right = this.viewport.left + this.viewport.width;
        this.viewport.bottom = this.viewport.top + this.viewport.height;
        this.viewport.scale.x = this.context.canvas.width / this.viewport.width;
        this.viewport.scale.y = this.context.canvas.height / this.viewport.height;
    }

    begin() {
        this.context.save();
        this.applyScale();
        this.applyTranslation();
    }

    end() {
        this.context.restore();
    }

    applyScale() {
        this.context.scale(this.viewport.scale.x, this.viewport.scale.y);
    }

    applyTranslation() {
        this.context.translate(-this.viewport.left, -this.viewport.top);
    }

    zoomTo(z: number) {
        this.distance = z;
        this.updateViewport();
    }

    moveTo(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
        this.updateViewport();
    }

    screenToWorld(x: number, y: number, pt: IPoint): IPoint {
        return {
            x: (x / this.viewport.scale.x) + this.viewport.left,
            y: (y / this.viewport.scale.y) + this.viewport.top,
        };
    }

    worldToScreen(x: number, y: number, pt: IPoint): IPoint {
        return {
            x: (x - this.viewport.left) * (this.viewport.scale.x),
            y: (y - this.viewport.top) * (this.viewport.scale.y),
        };
    }

    follow(target: Vector, speed?: number, offset?: Vector) {
        if (speed) {
            if (speed <= 0 || speed > 1) {
                console.error("Camera.follow() argument 'speed' must be greater than zero and less than or equal to 1.");
                speed = 1;
            }
        } else {
            // No smoothness.
            speed = 1;
        }

        this._followTarget = target;
        this._followSpeed = speed;

        if (offset) {
            this._followOffset = offset.clone();
        } else {
            this._followOffset = Vector.zero.clone();
        }
    }

    stopFollowing() {
        this._followTarget = undefined;
    }

    update(elapsed: number) {
        if (!this._followTarget) {
            return;
        }

        let targetPos = Vector.add(this._followTarget, this._followOffset);
        Vector.lerp(this.position, targetPos, this._followSpeed, this.position);

        this.updateViewport();
    }
}