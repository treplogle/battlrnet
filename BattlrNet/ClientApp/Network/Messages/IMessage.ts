import { MessageType } from "./MessageType";

export default interface IMessage {
    messageType: MessageType;

    minimumDataLength: number;
    fromBytes: (data: DataView, littleEndian: boolean) => void;
    toBytes: (littleEndian: boolean) => ArrayBuffer;
}