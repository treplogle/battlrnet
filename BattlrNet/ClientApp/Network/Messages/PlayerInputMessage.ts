import IMessage from "./IMessage";
import { MessageType } from "./MessageType";
import { InputActionType } from "../../InputActionType";
import Utilities from "../../Utilities";
import Vector from "../../Vector";

export default class PlayerInputMessage implements IMessage {
    messageType = MessageType.PlayerInput;
    minimumDataLength = 7;

    input: InputActionType;
    sequence: number;

    // These is for local use and not sent to the server.
    elapsed: number;

    // Player state for history replay
    velocity: Vector;

    lastJump = false;
    lastDown = false;
    moveRight = false;
    moveLeft = false;
    moveDown = false;
    jumping = false;
    running = false;

    pushedRightWall = false;
    pushesRightWall = false;
    pushedLeftWall = false;
    pushesLeftWall = false;
    wasOnGround = false;
    onGround = false;
    wasAtCeiling = false;
    atCeiling = false;
    onOneWayPlatform = false;

    get right() { return Utilities.FlagTest(this.input, InputActionType.Right); }
    get left() { return Utilities.FlagTest(this.input, InputActionType.Left); }
    get up() { return Utilities.FlagTest(this.input, InputActionType.Up); }
    get down() { return Utilities.FlagTest(this.input, InputActionType.Down); }
    get jump() { return Utilities.FlagTest(this.input, InputActionType.Jump); }
    get run() { return Utilities.FlagTest(this.input, InputActionType.Run); }
    get action1() { return Utilities.FlagTest(this.input, InputActionType.Action1); }
    get action2() { return Utilities.FlagTest(this.input, InputActionType.Action2); }
    get action3() { return Utilities.FlagTest(this.input, InputActionType.Action3); }

    // Not used on the client
    fromBytes(data: DataView, littleEndian: boolean) { }

    toBytes(littleEndian: boolean) {
        const buffer = new ArrayBuffer(this.minimumDataLength);
        const view = new DataView(buffer);

        view.setUint8(0, this.messageType);
        view.setUint16(1, this.input, littleEndian);
        view.setInt32(3, this.sequence, littleEndian);

        return buffer;
    }
}