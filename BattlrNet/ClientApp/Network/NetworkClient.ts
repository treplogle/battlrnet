import { MessageType } from "./Messages/MessageType";
import PingMessage from "./Messages/PingMessage";
import JoinAcceptedMessage from "./Messages/JoinAcceptedMessage";
import { RejectReason } from "./Messages/RejectReason";
import IMessage from "./Messages/IMessage";
import JoinRequestMessage from "./Messages/JoinRequestMessage";
import { InputActionType } from "../InputActionType";
import PlayerInputMessage from "./Messages/PlayerInputMessage";
import PositionMessage from "./Messages/PositionMessage";
import LocalPlayer from "../LocalPlayer";
import StateUpdateMessage from "./Messages/StateUpdateMessage";
import Color from "../Color";
import PlayerInfoMessage from "./Messages/PlayerInfoMessage";
import PlayerInfoRequestMessage from "./Messages/PlayerInfoRequestMessage";

export default class NetworkClient {
    private socket: WebSocket;
    private pingTime = 0;
    private pingID = 0;
    private pingTimeout = 0;

    private _socketReady = false;
    get socketReady() { return this._socketReady; }

    private _joinedGame = false;
    get joinedGame() { return this._joinedGame; }

    private _clientTime = 0;
    get clientTime() { return this._clientTime; }

    private _serverTime = 0;
    get serverTime() { return this._serverTime; }

    private _delay = 0.1;
    get delay() { return this._delay; }

    private _serverIsLittleEndian = false;
    get serverIsLittleEndian() { return this._serverIsLittleEndian; }

    private _playerID = 0;
    get playerID() { return this._playerID; }

    // Callbacks
    public onJoined: (id: number, name: string, color: Color) => void;
    public onOpen: (ev: Event) => void;
    public onClose: (ev: CloseEvent) => void;
    public onError: (ev: Event) => void;
    public onData: (ev: MessageEvent) => void;
    public onMessage: (msg: IMessage) => void;

    // Debug
    private pingElement: HTMLElement;
    public fakeDelay: number;

    constructor(private connectionUrl: string, private pingInterval: number) {
        this.pingElement = document.getElementById("debug-ping");
    }

    private sendMessage(msg: IMessage) {
        if (!this._socketReady) {
            return;
        }

        const buffer = msg.toBytes(this._serverIsLittleEndian);

        if (this.fakeDelay) {
            setTimeout(() => this.socket.send(buffer), this.fakeDelay);
        } else {
            this.socket.send(buffer);
        }
    }

    private onSocketOpened(ev: Event) {
        console.debug("Socket opened");

        this._socketReady = true;

        const msg = new JoinRequestMessage();
        msg.name = "Duder " + Math.round(Math.random() * 9999);

        this.sendMessage(msg);

        if (this.onOpen) { this.onOpen(ev); }
    }

    private onSocketClosed(ev: CloseEvent) {
        console.debug("Socket closed");

        this._socketReady = false;
        this._joinedGame = false;

        clearTimeout(this.pingTimeout);
        this.socket = undefined;

        if (this.onClose) { this.onClose(ev); }
    }

    private onSocketError(ev: Event) {
        console.error("Socket error");
        console.dir(ev);
        if (this.onError) { this.onError(ev); }
    }

    private onSocketMessage(ev: MessageEvent) {
        this.processMessage(ev.data as ArrayBuffer);
        if (this.onData) { this.onData(ev); }
    }

    private ping() {
        if (!this._socketReady) {
            return;
        }

        const msg = new PingMessage();
        msg.pingID = ++this.pingID;

        this.pingTime = window.performance.now();
        this.sendMessage(msg);
    }

    // ===================================
    // Message processing

    private processMessage(data: ArrayBuffer) {
        if (!data || data.byteLength === 0) {
            console.warn("Received empty data from server.");
            return;
        }

        const view = new DataView(data);
        const msgTypeVal = view.getUint8(0);
        const msgType = msgTypeVal as MessageType;

        let msg: IMessage = undefined;

        switch (msgType) {
            case MessageType.StateUpdate: msg = this.processStateUpdate(view); break;
            case MessageType.Ping: msg = this.processPing(view); break;
            case MessageType.PlayerInfo: msg = this.processPlayerInfo(view); break;
            case MessageType.JoinAccepted: msg = this.processJoinAccepted(view); break;
            default:
                console.warn(`Received unsupported message type: ${msgTypeVal}`);
                break;
        }

        if (msg != undefined && this.onMessage) {
            this.onMessage(msg);
        }
    }

    private processJoinAccepted(data: DataView): IMessage {
        const msg = new JoinAcceptedMessage();

        if (data.byteLength < msg.minimumDataLength) {
            console.error("Received invalid JoinAccept message.");
            this.disconnect();
            return undefined;
        }

        msg.fromBytes(data, this._serverIsLittleEndian);

        this._serverIsLittleEndian = msg.isLittleEndian;

        if (msg.accepted) {
            this._playerID = msg.id;

            this._joinedGame = true;
            if (this.onJoined) { this.onJoined(this._playerID, msg.name, msg.color); }

            this.ping();
        } else {
            let rejectReason;
            switch (msg.rejectReason) {
                case RejectReason.Banned: rejectReason = "You have been banned"; break;
                case RejectReason.NameInUse: rejectReason = "The chosen name is already in use"; break;
                case RejectReason.TooManyPlayers: rejectReason = "The server already has the maximum allowed players"; break;
                default: rejectReason = "Unknown"; break;
            }

            console.error("Unable to join game: " + rejectReason);
            this.disconnect();
        }

        return msg;
    }

    private processPing(data: DataView): IMessage {
        const msg = new PingMessage();

        if (data.byteLength < msg.minimumDataLength) {
            console.warn("Received invalid Ping message.");
            return undefined;
        }

        msg.fromBytes(data, this._serverIsLittleEndian);

        const receiveTime = window.performance.now();
        this._delay = (receiveTime - this.pingTime) / 2000; // Half of the time and ms to seconds.

        if (this._socketReady) {
            this.pingTimeout = setTimeout(() => this.ping(), this.pingInterval);
        }

        this.pingElement.innerText = Math.round(this._delay * 2000) + "";
        console.log("Server average frame time: " + msg.avgFrameTime);

        return msg;
    }

    private processStateUpdate(data: DataView): IMessage {
        const msg = new StateUpdateMessage();

        if (data.byteLength < msg.minimumDataLength) {
            console.warn("Received invalid State Update message.");
            return undefined;
        }

        msg.fromBytes(data, this._serverIsLittleEndian);

        return msg;
    }

    private processPlayerInfo(data: DataView): IMessage {
        const msg = new PlayerInfoMessage();
        if (data.byteLength < msg.minimumDataLength) {
            console.warn("Received invalid Player Info message.");
            return undefined;
        }

        msg.fromBytes(data, this._serverIsLittleEndian);

        return msg;
    }

    // ===================================

    public connect() {
        this.socket = new WebSocket(this.connectionUrl);
        this.socket.binaryType = "arraybuffer";

        this.socket.onopen = this.onSocketOpened.bind(this);
        this.socket.onclose = this.onSocketClosed.bind(this);
        this.socket.onerror = this.onSocketError.bind(this);
        this.socket.onmessage = this.onSocketMessage.bind(this);
    }

    public disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    public update(elapsed: number) {
        this._clientTime += elapsed;
        this._serverTime += elapsed;
    }

    public createInputMessage(input: InputActionType, sequence: number, player: LocalPlayer) {
        const msg = new PlayerInputMessage();

        msg.input = input;
        msg.sequence = sequence;

        // These are used for rewinding the player for server reconciliation.
        // They aren't sent to the server.
        msg.velocity = player.velocity.clone();
        msg.lastJump = player.lastJump;
        msg.lastDown = player.lastDown;
        msg.moveRight = player.moveRight;
        msg.moveLeft = player.moveLeft;
        msg.moveDown = player.moveDown;
        msg.jumping = player.jumping;
        msg.running = player.running;
        msg.pushedRightWall = player.pushedRightWall;
        msg.pushesRightWall = player.pushesRightWall;
        msg.pushedLeftWall = player.pushedLeftWall;
        msg.pushesLeftWall = player.pushesLeftWall;
        msg.wasOnGround = player.wasOnGround;
        msg.onGround = player.onGround;
        msg.wasAtCeiling = player.wasAtCeiling;
        msg.atCeiling = player.atCeiling;
        msg.onOneWayPlatform = player.onOneWayPlatform;

        return msg;
    }

    public sendInput(msg: PlayerInputMessage) {
        this.sendMessage(msg);
    }

    public getPlayerInfo(id: number) {
        const msg = new PlayerInfoRequestMessage();
        msg.id = id;
        this.sendMessage(msg);
    }
}