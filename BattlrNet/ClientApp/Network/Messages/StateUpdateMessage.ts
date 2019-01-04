import IMessage from "./IMessage";
import { MessageType } from "./MessageType";
import PositionMessage from "./PositionMessage";

export default class StateUpdateMessage implements IMessage {
    messageType = MessageType.StateUpdate;
    minimumDataLength = 1;

    players: Array<PositionMessage>;

    fromBytes(data: DataView, littleEndian: boolean) {

        this.players = [];

        const numPlayers = data.getUint8(1);
        let index = 2;

        for (let i = 0; i < numPlayers; i++) {
            const pos = new PositionMessage();
            this.players.push(pos);

            pos.id = data.getUint8(index);

            pos.positionX = data.getFloat32(index + 1, littleEndian);
            pos.positionY = data.getFloat32(index + 5, littleEndian);
            pos.velocityX = data.getFloat32(index + 9, littleEndian);
            pos.velocityY = data.getFloat32(index + 13, littleEndian);
            pos.sequence = data.getInt32(index + 17, littleEndian);

            index += 21;
        }
    }

    // Not used on client.
    toBytes(littleEndian: boolean): ArrayBuffer { return null; }
}