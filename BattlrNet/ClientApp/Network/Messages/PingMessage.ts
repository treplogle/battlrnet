import IMessage from "./IMessage";
import { MessageType } from "./MessageType";

export default class PingMessage implements IMessage {
    messageType = MessageType.Ping;
    minimumDataLength = 9;

    pingID: number;
    avgFrameTime: number;

    fromBytes(data: DataView, littleEndian: boolean) {
        this.pingID = data.getInt32(1, littleEndian);
        this.avgFrameTime = data.getFloat32(5, littleEndian);
    }

    toBytes(littleEndian: boolean) {
        const buffer = new ArrayBuffer(this.minimumDataLength);
        const view = new DataView(buffer);

        view.setUint8(0, this.messageType);
        view.setInt32(1, this.pingID, littleEndian);

        return buffer;
    }
}