using System;

namespace BattlrNet.Code.Game
{
    public static class Constants
    {
        /// <summary>
        /// Decimals places to which to round for network messages.
        /// </summary>
        public static readonly int NetworkPrecision = 3;

        public static readonly float TileSize = 32;
        public static readonly float HalfTile = TileSize / 2;
        public static readonly float Gravity = TileSize * 120;
        public static readonly float DefaultWalkSpeed = TileSize * 10;
        public static readonly float DefaultJumpSpeed = -TileSize * 32;
        public static readonly float MaxFallSpeed = TileSize * 100;
        public static readonly float DefaultAccel = TileSize * 100;
        public static readonly float DefaultDecel = TileSize * 150;
        public static readonly float OneWayPlatformThreshold = 2;
    }
}
