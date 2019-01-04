import IMessage from "./IMessage";
import { MessageType } from "./MessageType";

export default class PositionMessage implements IMessage {
    messageType = MessageType.Position;
    minimumDataLength = 29;

    public id: number;
    public positionX: number;
    public positionY: number;
    public velocityX: number;
    public velocityY: number;
    public tick: number;
    public sequence: number;

    fromBytes(data: DataView, littleEndian: boolean) {
        this.id = data.getInt32(1, littleEndian);
        this.positionX = data.getFloat32(5, littleEndian);
        this.positionY = data.getFloat32(9, littleEndian);
        this.velocityX = data.getFloat32(13, littleEndian);
        this.velocityY = data.getFloat32(17, littleEndian);
        this.tick = data.getInt32(21, littleEndian);
        this.sequence = data.getInt32(25, littleEndian);
    }

    // Not used on client.
    toBytes(littleEndian: boolean): ArrayBuffer { return null; }
}