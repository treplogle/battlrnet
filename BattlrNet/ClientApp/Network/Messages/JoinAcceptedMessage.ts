import IMessage from "./IMessage";
import { MessageType } from "./MessageType";
import { RejectReason } from "./RejectReason";
import NetworkHelper from "../NetworkHelper";
import Color from "../../Color";

export default class JoinAcceptedMessage implements IMessage {
    messageType = MessageType.JoinAccepted;
    minimumDataLength = 20;

    accepted: boolean;
    rejectReason: RejectReason;
    isLittleEndian: boolean;
    id: number;
    mapID: number;
    color: Color;
    name: string;

    fromBytes(data: DataView, littleEndian: boolean) {
        this.accepted = data.getUint8(1) === 1;
        this.rejectReason = data.getUint8(2) as RejectReason;
        this.isLittleEndian = data.getUint8(3) === 1;
        this.id = data.getUint8(4);
        this.mapID = data.getInt32(5, this.isLittleEndian);

        this.color = new Color(data.getUint8(9), data.getUint8(10), data.getUint8(11));

        const length = data.getUint8(12);

        const nameBuffer = new ArrayBuffer(length);
        const nameView = new DataView(nameBuffer);
        for (let i = 0; i < nameBuffer.byteLength; i++) {
            nameView.setUint8(i, data.getUint8(13 + i));
        }
        
        this.name = NetworkHelper.ArrayBufferToString(nameBuffer);
    }

    // Not used on client
    toBytes(littleEndian: boolean) { return new ArrayBuffer(0); }
}