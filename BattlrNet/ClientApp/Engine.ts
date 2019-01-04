import InputManager from "./InputManager";
import Camera from "./Camera";
import MovingObject from "./MovingObject";
import Vector from "./Vector";
import Entity from "./Entity";
import Constants from "./Constants";
import IPoint from "./IPoint";
import { InputActionType } from "./InputActionType";
import { Map, MapTileType } from "./Map";
import NetworkClient from "./Network/NetworkClient";
import PlayerInputMessage from "./Network/Messages/PlayerInputMessage";
import IMessage from "./Network/Messages/IMessage";
import { MessageType } from "./Network/Messages/MessageType";
import Utilities from "./Utilities";
import LocalPlayer from "./LocalPlayer";
import PositionMessage from "./Network/Messages/PositionMessage";
import JoinAcceptedMessage from "./Network/Messages/JoinAcceptedMessage";
import StateUpdateMessage from "./Network/Messages/StateUpdateMessage";
import Color from "./Color";
import PlayerInfoMessage from "./Network/Messages/PlayerInfoMessage";

export default class Engine {
    public clearColor = "#334";

    private context: CanvasRenderingContext2D;
    private camera: Camera;
    private input: InputManager;
    private networkClient: NetworkClient;

    private timerWorker: Worker;
    private lastUpdate: number;
    private tickInterval: number;
    private hasPerfTimer = false;
    private renderTime = 0;

    private ready = false;
    public map: Map;
    private player: LocalPlayer;

    private otherPlayers: Array<Entity> = [];

    private tickID = 0;
    private inputSequence = 0;
    private inputHistory: Array<PlayerInputMessage> = [];
    private lastInput: InputActionType = InputActionType.None;

    private firstDraw = false;

    constructor(private canvas: HTMLCanvasElement) {
        this.context = this.canvas.getContext("2d");

        const scheme = document.location.protocol === "https:" ? "wss" : "ws";
        const port = document.location.port ? (":" + document.location.port) : "";
        const connectionUrl = scheme + "://" + document.location.hostname + port;
        this.networkClient = new NetworkClient(connectionUrl, 1000);

        this.networkClient.fakeDelay = 0;

        this.networkClient.onJoined = this.onJoined.bind(this);
        this.networkClient.onMessage = this.onMessage.bind(this);

        this.networkClient.connect();

        this.camera = new Camera(this.context);
        this.camera.distance = 2500;

        this.setupInput();

        if (window.performance && window.performance.now) {
            this.hasPerfTimer = true;
        }

        window.addEventListener("resize", () => this.updateCanvasSize());
        this.updateCanvasSize();

        // TODO: Wait until join accepted to start game.

        this.player = new LocalPlayer(this, Vector.zero.clone(), new Vector(Constants.tileSize * 0.5 * 0.8, Constants.tileSize * 0.5 * 1.5));
        this.player.position.x = Constants.tileSize * 30;
        this.player.position.y = Constants.tileSize * 98;
        this.player.drawPosition.x = Constants.tileSize * 30;
        this.player.drawPosition.y = Constants.tileSize * 98;

        this.camera.moveTo(this.player.position.x, this.player.position.y);
        this.camera.follow(this.player.drawPosition, 0.1);

        this.timerWorker = new Worker("/js/timer.js");
        this.timerWorker.onmessage = () => this.tick();
        this.timerWorker.postMessage({ id: 1, type: "setInterval", time: 16 });
    }

    private setupInput() {
        this.input = new InputManager();

        this.input.addInputAction(InputActionType.Left, [65, 37]);
        this.input.addInputAction(InputActionType.Right, [68, 39]);
        this.input.addInputAction(InputActionType.Up, [87, 38]);
        this.input.addInputAction(InputActionType.Down, [83, 40]);
        this.input.addInputAction(InputActionType.Jump, [32]);
        this.input.addInputAction(InputActionType.Run, [16]);
        this.input.addInputAction(InputActionType.Action1, [74, 67]);
        this.input.addInputAction(InputActionType.Action2, [75, 88]);
        this.input.addInputAction(InputActionType.Action3, [76, 90]);
        this.input.addInputAction(InputActionType.Select, [13, 32]);
        this.input.addInputAction(InputActionType.Cancel, [27, 8]);
    }

    private clearScreen(clearColor: string) {
        this.context.fillStyle = clearColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private updateCanvasSize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.camera.updateViewport();
    }

    private drawRect(x: number, y: number, w: number, h: number, color: string) {
        x -= w / 2;
        y -= h / 2;
        this.context.fillStyle = color;
        this.context.fillRect(x, y, w, h);
    }

    private drawName(name: string, x: number, y: number) {
        this.context.fillStyle = "white";
        this.context.font = "20px Arial";
        const size = this.context.measureText(name);
        this.context.fillText(name, x - (size.width * 0.5), y);
    }

    private getElaspedTime() {
        let now: number;
        if (this.hasPerfTimer) {
            now = window.performance.now();
        } else {
            now = (new Date()).getTime();
        }

        if (this.lastUpdate === undefined) {
            this.lastUpdate = now;
        }

        const elapsed = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        return elapsed;
    }

    private tick() {
        const elapsed = this.getElaspedTime();

        if (elapsed > 0.020) {
            console.warn("Tick time exceeded 20ms: " + elapsed);
        }

        if (!this.ready) {
            this.networkClient.update(elapsed);
            return;
        }

        if (elapsed >= 0.032) {
            // Tick time is way too high, let's do multiple updates this tick.
            let remain = elapsed;
            while (remain > 0.08) {
                const tmpElapsed = Math.min(0.016, remain);
                this.networkClient.update(tmpElapsed);
                this.update(tmpElapsed);
                remain -= 0.016;
                this.tickID++;
            }
        } else {
            this.networkClient.update(elapsed);
            this.update(elapsed);
            this.tickID++;
        }

        if (!this.firstDraw) {
            this.firstDraw = true;
            this.draw();
        }
    }

    private inputTime = 0;
    private lastMsgTime = 0;

    private frameTimes: Array<number> = [];
    
    private update(elapsed: number) {
        this.input.update(elapsed);

        this.frameTimes.push(elapsed * 1000);
        if (this.frameTimes.length > 100) {
            const total = this.frameTimes.reduce((acc, cur) => acc + cur);
            //console.log(`Avg frametime: ${total / this.frameTimes.length} ms`);
            this.frameTimes.splice(0, this.frameTimes.length);
        }

        this.inputTime += elapsed;

        let inputActions = InputActionType.None;

        for (let i = 0; i < Utilities.AllInputActions.length; i++) {
            const action = Utilities.AllInputActions[i];
            if (this.input.getAction(action)) {
                inputActions |= action;
            }
        }

        //if (!this.input.getActionDown(InputActionType.Jump)) {
        //    // Only set jump to true during the frame it was pressed.
        //    inputActions = Utilities.FlagUnset(inputActions, InputActionType.Jump);
        //}

        //if (!this.input.getActionDown(InputActionType.Down)) {
        //    // Only set fall-through to true during the frame it was pressed.
        //    inputActions = Utilities.FlagUnset(inputActions, InputActionType.Down);
        //}

        const msg = this.networkClient.createInputMessage(inputActions, ++this.inputSequence, this.player);
        this.inputHistory.push(msg);

        this.inputTime = 0;
        this.lastMsgTime = 0;
        this.networkClient.sendInput(msg);

        //if (inputActions !== this.lastInput || this.inputTime > 1) {
        //    // Only send to server when the state changes or after 1 second.

        //    const msg = this.networkClient.createInputMessage(inputActions, ++this.inputSequence, this.tickID, this.player);
        //    this.inputHistory.push(msg);

        //    this.inputTime = 0;
        //    this.lastMsgTime = 0;
        //    this.networkClient.sendInput(msg);
        //}

        this.lastMsgTime += elapsed;

        this.lastInput = inputActions;

        // Update other players.
        for (let e = this.otherPlayers.length - 1; e >= 0; e--) {
            const entity = this.otherPlayers[e];
            entity.lastUpdate += elapsed;
            if (entity.lastUpdate >= 5) {
                // We haven't received an update for this player in 5 seconds
                // Remove them.
                this.otherPlayers.splice(e, 1);
            }
        }

        this.player.playerUpdate(inputActions, elapsed);
        this.camera.update(elapsed);
    }

    private lerpDrawPosition(drawPosition: Vector, realPosition: Vector, amount: number) {
        const drawDist = Vector.subtract(drawPosition, realPosition).length();
        if (drawDist > 100) {
            // Too far, snap to real position.
            drawPosition.copyFrom(realPosition);
        } else if (drawDist > 0) {
            if (drawDist <= 1) {
                // Close enough, snap to real position.
                drawPosition.copyFrom(realPosition);
            } else {
                Vector.lerp(drawPosition, realPosition, amount, drawPosition);
            }
        } else if (drawDist < 0) {
            // This shouldn't be possible, but I seen it once, so let's just check for it and reset our draw position.
            drawPosition.copyFrom(realPosition);
        }
    }

    private draw() {
        this.clearScreen(this.clearColor);

        this.lerpDrawPosition(this.player.drawPosition, this.player.position, 0.65);
        
        //this.camera.moveTo(this.player.drawPosition.x, this.player.drawPosition.y);

        this.camera.begin();

        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tile = this.map.tiles[y][x];
                if (tile === MapTileType.Empty) {
                    continue;
                } else if (tile === MapTileType.Block) {
                    this.drawRect(x * Constants.tileSize, y * Constants.tileSize, Constants.tileSize, Constants.tileSize, "#351E0B");
                } else if (tile === MapTileType.OneWay) {
                    this.drawRect(x * Constants.tileSize, y * Constants.tileSize - Constants.tileSize * 0.25, Constants.tileSize, Constants.tileSize * 0.5, "#6A3F1C");
                }
            }
        }

        const playerSize = this.player.aabb.getSize();

        const delEntities: Array<Entity> = [];

        // Draw other players.
        for (const e of this.otherPlayers) {
            if (!e.ready) { continue; }
            this.lerpDrawPosition(e.drawPosition, e.position, 0.55);
            this.drawRect(e.drawPosition.x, e.drawPosition.y, playerSize.x * this.player.scale.x, playerSize.y * this.player.scale.y, e.color.css);
            this.drawName(e.name, e.drawPosition.x, e.drawPosition.y - playerSize.y);
        }
        
        this.drawRect(this.player.position.x, this.player.position.y, playerSize.x * this.player.scale.x, playerSize.y * this.player.scale.y, this.player.color.css);
        //this.drawRect(this.player.drawPosition.x, this.player.drawPosition.y, playerSize.x * this.player.scale.x, playerSize.y * this.player.scale.y, this.player.color);
        this.drawName(this.player.name, this.player.position.x, this.player.position.y - playerSize.y);
        //this.drawRect(this.player.serverPosition.x, this.player.serverPosition.y, playerSize.x * this.player.scale.x, playerSize.y * this.player.scale.y, "rgba(255,0,0,0.5)");

        this.camera.end();

        // @ts-ignore: This is defined in the main page.
        window.fpsMeter.tick();

        requestAnimationFrame(() => this.draw());
    }

    private onJoined(id: number, name: string, color: Color) {
        this.player.id = id;
        this.player.name = name;
        this.player.color = color;
    }

    private onMessage(msg: IMessage) {
        //console.log(`Received message type ${msg.messageType} from server.`);

        if (msg.messageType === MessageType.StateUpdate) {
            this.processStateUpdate(msg as StateUpdateMessage);
        } else if (msg.messageType === MessageType.PlayerInfo) {
            this.updatePlayerInfo(msg as PlayerInfoMessage);
        } else if (msg.messageType === MessageType.JoinAccepted) {
            this.loadMap((msg as JoinAcceptedMessage).mapID);
            this.player.ready = true;
        }
    }

    private loadMap(id: number) {
        const self = this;

        // @ts-ignore: Axios is loaded from a CDN
        axios.get("/maps/" + id + ".json")
            .then(function (response: any) {
                self.map = new Map(response.data.Name, response.data.Width, response.data.Height);
                self.map.loadData(response.data.Tiles);
                self.ready = true;
            })
            .catch(function (error:any) {
                console.error(error);
            });
    }

    private processStateUpdate(state: StateUpdateMessage) {
        if (!this.ready) {
            return;
        }

        for (const p of state.players) {
            if (p.id === this.player.id) {
                // Current player.
                this.serverReconciliation(p);
            } else {
                this.updateOtherPlayer(p);
            }
        }
    }

    private rewindPlayer(input: PlayerInputMessage) {
        this.player.lastJump = input.lastJump;
        this.player.lastDown = input.lastDown;
        this.player.moveRight = input.moveRight;
        this.player.moveLeft = input.moveLeft;
        this.player.moveDown = input.moveDown;
        this.player.jumping = input.jumping;
        this.player.running = input.running;
        this.player.pushedRightWall = input.pushedRightWall;
        this.player.pushesRightWall = input.pushesRightWall;
        this.player.pushedLeftWall = input.pushedLeftWall;
        this.player.pushesLeftWall = input.pushesLeftWall;
        this.player.wasOnGround = input.wasOnGround;
        this.player.onGround = input.onGround;
        this.player.wasAtCeiling = input.wasAtCeiling;
        this.player.atCeiling = input.atCeiling;
        this.player.onOneWayPlatform = input.onOneWayPlatform;
    }

    private serverReconciliation(msg: PositionMessage) {
        this.player.serverPosition.x = msg.positionX;
        this.player.serverPosition.y = msg.positionY;

        // Set our state to server's data.
        this.player.position.x = msg.positionX;
        this.player.position.y = msg.positionY;
        this.player.velocity.x = msg.velocityX;
        this.player.velocity.y = msg.velocityY;

        // Remove inputs already processed by the server.
        while (this.inputHistory.length && this.inputHistory[0].sequence <= msg.sequence) {
            this.inputHistory.shift();
        }

        if (this.inputHistory.length === 0) {
            // No inputs to process.
            //console.error("No inputs to replay.  This shouldn't happen.");
            return;
        }

        // Rewind back to first input not processed by the server.
        this.rewindPlayer(this.inputHistory[0]);

        // Re-simulate unprocessed inputs.
        for (let i = 0; i < this.inputHistory.length; i++) {
            const input = this.inputHistory[i];
            this.player.playerUpdate(input.input, 0.016);
        }
    }

    private updatePlayerInfo(msg: PlayerInfoMessage) {
        const op = this.otherPlayers.filter((e, i) => e.id === msg.id);
        if (op.length) {
            op[0].name = msg.name;
            op[0].color = msg.color;
            op[0].ready = true;
        }
    }

    private updateOtherPlayer(msg: PositionMessage) {
        const op = this.otherPlayers.filter((e, i) => e.id === msg.id);
        if (op.length) {
            // Existing client
            op[0].position.x = msg.positionX;
            op[0].position.y = msg.positionY;
            op[0].lastUpdate = 0;
        } else {
            // New client
            this.networkClient.getPlayerInfo(msg.id);
            const entity = new Entity(this, new Vector(msg.positionX, msg.positionY), new Vector(Constants.tileSize * 0.5 * 0.8, Constants.tileSize * 0.5 * 1.5));
            entity.id = msg.id;
            this.otherPlayers.push(entity);
        }
    }
}