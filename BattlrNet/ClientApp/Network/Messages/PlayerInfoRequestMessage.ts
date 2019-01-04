import IMessage from "./IMessage";
import { MessageType } from "./MessageType";

export default class PlayerInfoRequestMessage implements IMessage {
    messageType = MessageType.PlayerInfoRequest;
    minimumDataLength = 2;

    id: number;

    // Not sent by server.
    fromBytes(data: DataView, littleEndian: boolean) { }

    toBytes(littleEndian: boolean) {
        const buffer = new ArrayBuffer(this.minimumDataLength);
        const view = new DataView(buffer);

        view.setUint8(0, this.messageType);
        view.setUint8(1, this.id);

        return buffer;
    }
}