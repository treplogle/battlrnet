import IMessage from "./IMessage";
import { MessageType } from "./MessageType";
import Color from "../../Color";
import NetworkHelper from "../NetworkHelper";

export default class PlayerInfoMessage implements IMessage {
    messageType = MessageType.PlayerInfo;
    minimumDataLength = 6;

    id: number;
    color: Color;
    name: string;

    fromBytes(data: DataView, littleEndian: boolean) {
        this.id = data.getUint8(1);

        this.color = new Color(data.getUint8(2), data.getUint8(3), data.getUint8(4));

        const length = data.getUint8(5);

        const nameBuffer = new ArrayBuffer(length);
        const nameView = new DataView(nameBuffer);
        for (let i = 0; i < nameBuffer.byteLength; i++) {
            nameView.setUint8(i, data.getUint8(6 + i));
        }

        this.name = NetworkHelper.ArrayBufferToString(nameBuffer);
    }

    // Not used on client
    toBytes(littleEndian: boolean) { return new ArrayBuffer(0); }
}