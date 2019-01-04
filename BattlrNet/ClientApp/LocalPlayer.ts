import Entity from "./Entity";
import { InputActionType } from "./InputActionType";
import Utilities from "./Utilities";
import Vector from "./Vector";

export default class LocalPlayer extends Entity {

    public lastJump = false;
    public lastDown = false;

    public serverPosition = Vector.zero.clone();

    public playerUpdate(input: InputActionType, elapsed: number) {

        // Apply our input.

        if (Utilities.FlagTest(input, InputActionType.Right)) {
            this.moveRight = true;
            this.moveLeft = false;
        } else if (Utilities.FlagTest(input, InputActionType.Left)) {
            this.moveRight = false;
            this.moveLeft = true;
        } else {
            this.moveRight = false;
            this.moveLeft = false;
        }

        if (Utilities.FlagTest(input, InputActionType.Run)) {
            this.running = true;
        } else {
            this.running = false;
        }

        if (Utilities.FlagTest(input, InputActionType.Jump)) {
            if (!this.lastJump) {
                this.jumping = true;
                this.lastJump = true;
            }
        } else {
            this.jumping = false;
            this.lastJump = false;
        }

        if (Utilities.FlagTest(input, InputActionType.Down)) {
            if (!this.lastDown) {
                this.moveDown = true;
                this.lastDown = true;
            }
        } else {
            this.moveDown = false;
            this.lastDown = false;
        }

        super.update(elapsed);
    }
}