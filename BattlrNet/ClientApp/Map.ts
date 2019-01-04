import Vector from "./Vector";
import IPoint from "./IPoint";
import Constants from "./Constants";

export const enum MapTileType {
    Empty,
    Block,
    OneWay
}

export class Map {
    public position: Vector = Vector.zero.clone();
    public tiles: Array<Array<MapTileType>>;

    constructor(public name: string, public width: number, public height: number) {
        this.tiles = [];
        for (let y = 0; y < height; y++) {
            const row: Array<MapTileType> = [];
            this.tiles.push(row);
            for (let x = 0; x < width; x++) {
                let type = MapTileType.Empty;

                //if (x === 0 || y === 0 || x >= width - 1 || y >= height - 1) {
                //    type = MapTileType.Block;
                //} else if (Math.random() < 0.1) {
                //    if (Math.random() < 0.8) {
                //        type = MapTileType.OneWay;
                //    } else {
                //        type = MapTileType.Block;
                //    }
                //}

                row.push(type);
            }
        }
    }

    public loadData(data: Array<Array<MapTileType>>) {
        for (let y = 0; y < this.height; y++) {
            const row = this.tiles[y];
            for (let x = 0; x < this.width; x++) {
                row[x] = data[y][x];
            }
        }
    }

    public getTilePosAtPoint(pt: Vector): IPoint {
        return {
            x: Math.floor((pt.x - this.position.x + Constants.tileSize / 2) / Constants.tileSize),
            y: Math.floor((pt.y - this.position.y + Constants.tileSize / 2) / Constants.tileSize)
        };
    }

    public getMapTileYAtPoint(y: number) {
        return Math.floor((y - this.position.y + Constants.tileSize / 2) / Constants.tileSize);
    }

    public getMapTileXAtPoint(x: number) {
        return Math.floor((x - this.position.x + Constants.tileSize / 2) / Constants.tileSize);
    }

    public getMapTilePosition(x: number, y: number) {
        return new Vector(
            x * Constants.tileSize + this.position.x,
            y * Constants.tileSize + this.position.y,
        );
    }

    public getTile(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return MapTileType.Block;

        return this.tiles[y][x];
    }

    public isObstacle(x: number, y: number) {
        return this.getTile(x, y) === MapTileType.Block;
    }

    public isGround(x: number, y: number) {
        const tile = this.getTile(x, y);
        return tile === MapTileType.Block || tile === MapTileType.OneWay;
    }
}