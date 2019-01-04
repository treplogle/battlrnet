import Vector from "./Vector";
import MovingObject from "./MovingObject";
import { EntityState } from "./EntityState";
import { Map } from "./Map";
import { InputActionType } from "./InputActionType";
import Engine from "./Engine";
import Utilities from "./Utilities";

export default class Entity extends MovingObject {
    private readonly MinSpeed: number = 0.001;

    public entityState: EntityState = EntityState.Idle;

    private targetScale: Vector = Vector.one.clone();
    private scaleVelocity: number = 1;

    constructor(engine: Engine, position: Vector, aabbHalfSize: Vector) {
        super(engine, position, aabbHalfSize);
    }

    public update(elapsed: number) {
        super.update(elapsed);

        if (this.targetScale.x > this.scale.x) {
            this.scale.x += this.scaleVelocity * elapsed;
            if (this.scale.x > this.targetScale.x) {
                this.scale.x = this.targetScale.x;
            }
        }

        if (this.velocity.lengthSquared() < this.MinSpeed) {
            // Not moving at all
            this.entityState = EntityState.Idle;
            if (!this.wasOnGround) {
                // Just landed on the ground.
            }
        } else if (this.velocity.y < -this.MinSpeed) {
            // Moving up
            this.entityState = EntityState.Jumping;
            if (this.wasOnGround) {
                // Just started jumping
            }
        } else if (this.velocity.y > this.MinSpeed) {
            // Moving down
            this.entityState = EntityState.Falling;
        } else if (this.velocity.x < -this.MinSpeed) {
            // Walking left.
            this.entityState = EntityState.Walking;
        } else if (this.velocity.x > this.MinSpeed) {
            // Walking right.
            this.entityState = EntityState.Walking;
        }
    }
}