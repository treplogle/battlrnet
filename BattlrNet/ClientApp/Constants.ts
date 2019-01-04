export default class Constants {
    static readonly networkPrecision = 3;
    static readonly tileSize = 32;
    static readonly halfTile = Constants.tileSize / 2;
    static readonly gravity = Constants.tileSize * 120;
    static readonly defaultWalkSpeed = Constants.tileSize * 10;
    static readonly defaultJumpSpeed = -Constants.tileSize * 32;
    static readonly maxFallSpeed = Constants.tileSize * 100;
    static readonly defaultAccel = Constants.tileSize * 100;
    static readonly defaultDecel = Constants.tileSize * 150;
    static readonly oneWayPlatformThreshold = 2;
}