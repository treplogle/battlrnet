import IMessage from "./IMessage";
import { MessageType } from "./MessageType";
import NetworkHelper from "../NetworkHelper";

export default class JoinRequestMessage implements IMessage {
    messageType = MessageType.JoinRequest;
    minimumDataLength = 3;

    get maxNameLength() { return 25; }

    name: string;

    // Not used on client
    fromBytes(data: DataView, littleEndian: boolean) { }

    toBytes(littleEndian: boolean) {
        if (this.name.length > this.maxNameLength) {
            this.name = this.name.substr(0, this.maxNameLength);
        }

        const buffer = new ArrayBuffer(this.name.length * 2 + 2);
        const view = new DataView(buffer);

        view.setUint8(0, this.messageType);

        // Name length
        view.setUint8(1, this.name.length * 2); // 2 bytes per character.

        NetworkHelper.StringToArrayBuffer(this.name, buffer, 2);

        return buffer;
    }
}