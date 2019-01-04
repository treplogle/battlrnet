import Vector from "./Vector";
import AABB from "./AABB";
import Constants from "./Constants";
import { Direction } from "./Direction";
import IPoint from "./IPoint";
import { Map, MapTileType } from "./Map";
import { InputActionType } from "./InputActionType";
import Utilities from "./Utilities";
import Engine from "./Engine";
import Color from "./Color";

interface IGroundCheckResults {
    onGround: boolean;
    onOneWayPlatform: boolean;
    groundY: number;
}

export default class MovingObject {
    public id: number;

    public name: string = "";
    public color: Color = new Color();
    public lastUpdate: number;
    public drawPosition = Vector.zero.clone();
    public ready: boolean = false;

    public velocity = Vector.zero.clone();
    public maxVelocity = new Vector(Constants.defaultWalkSpeed, Constants.maxFallSpeed);
    public jumpSpeed = Constants.defaultJumpSpeed;
    public accel = Constants.defaultAccel;
    public decel = Constants.defaultDecel;
    public scale = Vector.one.clone();
    public aabbOffset = Vector.zero.clone();
    public aabb: AABB;

    public moveRight = false;
    public moveLeft = false;
    public moveDown = false;
    public jumping = false;
    public running = false;

    public pushedRightWall = false;
    public pushesRightWall = false;
    public pushedLeftWall = false;
    public pushesLeftWall = false;
    public wasOnGround = false;
    public onGround = false;
    public wasAtCeiling = false;
    public atCeiling = false;
    public onOneWayPlatform = false;

    private oldPosition: Vector;
    private oldSpeed = Vector.zero.clone();

    private groundCheckResults: IGroundCheckResults = {
        onGround: false,
        onOneWayPlatform: false,
        groundY: 0
    };

    constructor(private engine: Engine, public position: Vector, aabbHalfSize: Vector) {
        this.oldPosition = Vector.clone(position);
        this.aabb = new AABB(Vector.zero.clone(), Vector.clone(aabbHalfSize));
        Vector.add(this.position, this.aabbOffset, this.aabb.center);
        this.drawPosition.copyFrom(position);
    }

    public update(elapsed: number) {
        this.oldPosition.copyFrom(this.position);
        this.oldSpeed.copyFrom(this.velocity);

        this.wasOnGround = this.onGround;
        this.pushedRightWall = this.pushesRightWall;
        this.pushedLeftWall = this.pushesLeftWall;
        this.wasAtCeiling = this.atCeiling;

        const max = this.running ? this.maxVelocity.x * 1.5 : this.maxVelocity.x;
        let accel;

        if (this.moveRight && this.velocity.x < max) {
            if (this.velocity.x < 0) { accel = this.decel; }
            else { accel = this.accel; }

            this.velocity.x += accel * elapsed;

            if (this.velocity.x > max) {
                this.velocity.x = max;
            }
        } else if (this.moveLeft && this.velocity.x > -max) {
            if (this.velocity.x > 0) { accel = this.decel; }
            else { accel = this.accel; }

            this.velocity.x -= accel * elapsed;

            if (this.velocity.x < -max) {
                this.velocity.x = -max;
            }
        } else if (this.velocity.x > 0) {
            this.velocity.x -= this.decel * elapsed;
            if (this.velocity.x < 0) {
                this.velocity.x = 0;
            }
        } else if (this.velocity.x < 0) {
            this.velocity.x += this.decel * elapsed;
            if (this.velocity.x > 0) {
                this.velocity.x = 0;
            }
        }

        // This disables acceleration
        //if (this.moveRight)
        //    this.velocity.x = this.maxVelocity.x;
        //else if (this.moveLeft)
        //    this.velocity.x = -this.maxVelocity.x;
        //else
        //    this.velocity.x = 0;

        // TODO: Less agility in the air.

        if (this.jumping && this.onGround) {
            this.velocity.y = this.jumpSpeed;
        } else {
            this.velocity.y += Constants.gravity * elapsed;
        }

        this.jumping = false;

        this.position.add(Vector.multiply(this.velocity, elapsed));

        const oldCenter = Vector.add(this.oldPosition, this.aabbOffset);
        const center = Vector.add(this.position, this.aabbOffset);

        let rightWallX: number = undefined,
            leftWallX: number = undefined;

        if (this.velocity.x <= 0) {
            leftWallX = this.checkLeft(oldCenter, center);
            if (leftWallX != undefined) {
                if (this.oldPosition.x - this.aabb.halfSize.x + this.aabbOffset.x >= leftWallX) {
                    this.position.x = leftWallX + this.aabb.halfSize.x - this.aabbOffset.x;
                    this.pushesLeftWall = true;
                }

                this.velocity.x = Math.max(this.velocity.x, 0);
            } else {
                this.pushesLeftWall = false;
            }
        } else {
            this.pushesLeftWall = false;
        }

        if (this.velocity.x >= 0) {
            rightWallX = this.checkRight(oldCenter, center);
            if (rightWallX != undefined) {
                if (this.oldPosition.x + this.aabb.halfSize.x + this.aabbOffset.x <= rightWallX) {
                    this.position.x = rightWallX - this.aabb.halfSize.x - this.aabbOffset.x;
                    this.pushesRightWall = true;
                }

                this.velocity.x = Math.min(this.velocity.x, 0);
            } else {
                this.pushesRightWall = false;
            }
        } else {
            this.pushesRightWall = false;
        }

        if (this.velocity.y >= 0 && this.checkGround(oldCenter, center, this.groundCheckResults)) {
            this.position.y = this.groundCheckResults.groundY - this.aabb.halfSize.y - this.aabbOffset.y;
            this.onOneWayPlatform = this.groundCheckResults.onOneWayPlatform;
            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
            this.onOneWayPlatform = false;
        }

        this.atCeiling = false;
        if (this.velocity.y <= 0) {
            const ceilingY = this.checkCeiling(oldCenter, center);
            if (ceilingY !== undefined) {
                this.atCeiling = true;
                this.position.y = ceilingY + this.aabb.halfSize.y - this.aabbOffset.y + 1;
                this.velocity.y = 0;
            }
        }

        if (this.moveDown && this.onOneWayPlatform) {
            this.position.y += Constants.oneWayPlatformThreshold + 1;
        } else {
            this.moveDown = false;
        }

        // Round floating point values to help with network reconciliation.
        Utilities.roundVector(this.velocity, this.velocity);
        Utilities.roundVector(this.position, this.position);

        Vector.add(this.position, this.aabbOffset, this.aabb.center);
    }

    private checkGround(oldCenter: Vector, center: Vector, groundCheckResults: IGroundCheckResults) {
        groundCheckResults.onOneWayPlatform = false;
        groundCheckResults.onGround = false;
        groundCheckResults.groundY = 0;

        const oldBottomLeft = new Vector(
            oldCenter.x - this.aabb.halfSize.x + Vector.right.x,
            oldCenter.y + this.aabb.halfSize.y + Vector.down.y
        ).round();

        const newBottomLeft = new Vector(
            center.x - this.aabb.halfSize.x + Vector.right.x,
            center.y + this.aabb.halfSize.y + Vector.down.y
        ).round();

        const endY = this.engine.map.getMapTileYAtPoint(newBottomLeft.y);
        const begY = Math.min(this.engine.map.getMapTileYAtPoint(oldBottomLeft.y) + 1, endY);
        const dist = Math.max(Math.abs(endY - begY), 1);

        const checkedTile: Vector = new Vector(),
            bottomLeft: Vector = new Vector(),
            bottomRight: Vector = new Vector();

        let tileIndexX: number,
            tile: MapTileType;

        for (let tileIndexY = begY; tileIndexY <= endY; tileIndexY++) {
            Vector.lerp(oldBottomLeft, newBottomLeft, Math.abs(endY - tileIndexY) / dist, bottomLeft);
            bottomRight.x = bottomLeft.x + this.aabb.halfSize.x * 2 - 2;
            bottomRight.y = bottomLeft.y;

            checkedTile.copyFrom(bottomLeft);

            while (true) {
                checkedTile.x = Math.min(checkedTile.x, bottomRight.x);

                tileIndexX = this.engine.map.getMapTileXAtPoint(checkedTile.x);
                tile = this.engine.map.getTile(tileIndexX, tileIndexY);

                groundCheckResults.groundY = tileIndexY * Constants.tileSize - Constants.tileSize / 2 + this.engine.map.position.y;

                if (tile === MapTileType.Block) {
                    groundCheckResults.onGround = true;
                    groundCheckResults.onOneWayPlatform = false;
                    return true;
                } else if (tile === MapTileType.OneWay
                    && Math.abs(checkedTile.y - groundCheckResults.groundY) <= Constants.oneWayPlatformThreshold + (this.position.y - this.oldPosition.y)) {
                    groundCheckResults.onOneWayPlatform = true;
                }

                if (checkedTile.x >= bottomRight.x) {
                    if (groundCheckResults.onOneWayPlatform) {
                        return true;
                    }

                    break;
                }

                checkedTile.x += Constants.tileSize;
            }
        }

        return false;
    }

    private checkCeiling(oldCenter: Vector, center: Vector) {
        const oldTopRight = new Vector(
            oldCenter.x + this.aabb.halfSize.x - Vector.right.x,
            oldCenter.y - this.aabb.halfSize.y + Vector.up.y
        ).round();

        const newTopRight = new Vector(
            center.x + this.aabb.halfSize.x - Vector.right.x,
            center.y - this.aabb.halfSize.y + Vector.up.y
        ).round();

        const endY = this.engine.map.getMapTileYAtPoint(newTopRight.y);
        const begY = Math.max(this.engine.map.getMapTileYAtPoint(oldTopRight.y) - 1, endY);
        const dist = Math.max(Math.abs(endY - begY), 1);

        const checkedTile: Vector = new Vector(),
            topLeft: Vector = new Vector(),
            topRight: Vector = new Vector();

        let tileIndexX: number,
            tile: MapTileType;

        for (let tileIndexY = begY; tileIndexY >= endY; tileIndexY--) {
            Vector.lerp(oldTopRight, newTopRight, Math.abs(endY - tileIndexY) / dist, topRight);
            topLeft.x = topRight.x - this.aabb.halfSize.x * 2 + 2;
            topLeft.y = topRight.y;

            checkedTile.copyFrom(topLeft);

            while (true) {
                checkedTile.x = Math.min(checkedTile.x, topRight.x);
                tileIndexX = this.engine.map.getMapTileXAtPoint(checkedTile.x);
                tile = this.engine.map.getTile(tileIndexX, tileIndexY);

                if (tile === MapTileType.Block) {
                    return tileIndexY * Constants.tileSize + Constants.tileSize / 2 + this.engine.map.position.y;
                }

                if (checkedTile.x >= topRight.x) {
                    break;
                }

                checkedTile.x += Constants.tileSize;
            }
        }

        return undefined;
    }

    private checkLeft(oldCenter: Vector, center: Vector) {
        const oldBottomLeft = new Vector(
            oldCenter.x - this.aabb.halfSize.x - 1,
            oldCenter.y + this.aabb.halfSize.y - 1
        ).round();

        const newBottomLeft = new Vector(
            center.x - this.aabb.halfSize.x - 1,
            center.y + this.aabb.halfSize.y - 1
        ).round();

        const endX = this.engine.map.getMapTileXAtPoint(newBottomLeft.x);
        const begX = Math.max(this.engine.map.getMapTileXAtPoint(oldBottomLeft.x) - 1, endX);
        const dist = Math.max(Math.abs(endX - begX), 1);

        const checkedTile: Vector = new Vector(),
            bottomLeft: Vector = new Vector(),
            topLeft: Vector = new Vector();

        let tileIndexY: number,
            tile: MapTileType;

        for (let tileIndexX = begX; tileIndexX >= endX; tileIndexX--) {
            Vector.lerp(oldBottomLeft, newBottomLeft, Math.abs(endX - tileIndexX) / dist, bottomLeft);
            topLeft.x = bottomLeft.x;
            topLeft.y = bottomLeft.y - this.aabb.halfSize.y * 2 + 2;

            checkedTile.copyFrom(bottomLeft);

            while (true) {
                checkedTile.y = Math.max(checkedTile.y, topLeft.y);

                tileIndexY = this.engine.map.getMapTileYAtPoint(checkedTile.y);
                tile = this.engine.map.getTile(tileIndexX, tileIndexY);

                if (tile === MapTileType.Block) {
                    return tileIndexX * Constants.tileSize + Constants.tileSize / 2 + this.engine.map.position.x;
                }

                checkedTile.y -= Constants.tileSize;

                if (checkedTile.y <= topLeft.y) {
                    break;
                }
            }
        }

        return undefined;
    }

    private checkRight(oldCenter: Vector, center: Vector) {
        const oldBottomRight = new Vector(
            oldCenter.x + this.aabb.halfSize.x + 1,
            oldCenter.y + this.aabb.halfSize.y - 1
        ).round();

        const newBottomRight = new Vector(
            center.x + this.aabb.halfSize.x + 1,
            center.y + this.aabb.halfSize.y - 1
        ).round();

        const endX = this.engine.map.getMapTileXAtPoint(newBottomRight.x);
        const begX = Math.min(this.engine.map.getMapTileXAtPoint(oldBottomRight.x) + 1, endX);
        const dist = Math.max(Math.abs(endX - begX), 1);

        const checkedTile: Vector = new Vector(),
            bottomRight: Vector = new Vector(),
            topRight: Vector = new Vector();

        let tileIndexY: number,
            tile: MapTileType;

        for (let tileIndexX = begX; tileIndexX <= endX; tileIndexX++) {
            Vector.lerp(oldBottomRight, newBottomRight, Math.abs(endX - tileIndexX) / dist, bottomRight);
            topRight.x = bottomRight.x;
            topRight.y = bottomRight.y - this.aabb.halfSize.y * 2 + 2;

            checkedTile.copyFrom(bottomRight);

            while (true) {
                checkedTile.y = Math.max(checkedTile.y, topRight.y);

                tileIndexY = this.engine.map.getMapTileYAtPoint(checkedTile.y);
                tile = this.engine.map.getTile(tileIndexX, tileIndexY);

                if (tile === MapTileType.Block) {
                    return tileIndexX * Constants.tileSize - Constants.tileSize / 2 + this.engine.map.position.x;
                }

                checkedTile.y -= Constants.tileSize;

                if (checkedTile.y <= topRight.y) {
                    break;
                }
            }
        }

        return undefined;
    }
}