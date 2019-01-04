using System;
using System.Threading.Tasks;

namespace BattlrNet.Code.Game
{
    public enum MapTileType : byte
    {
        Empty = 0,
        Block = 1,
        OneWay = 2
    }

    public class Map
    {
        public Vector Position;
        public string Name { get; set; }
        public MapTileType[][] Tiles;
        public int Width;
        public int Height;

        public Map() { }

        public Map(int width, int height)
        {
            Width = width;
            Height = height;

            var random = new Random();

            Tiles = new MapTileType[height][];
            for (var y = 0; y < height; y++)
            {
                Tiles[y] = new MapTileType[width];
                var row = Tiles[y];
                for (var x = 0; x < width; x++)
                {
                    var type = MapTileType.Empty;

                    if (x == 0 || y == 0 || x >= width - 1 || y >= height - 1)
                    {
                        type = MapTileType.Block;
                    }
                    else if (random.NextDouble() < 0.1)
                    {
                        if (random.NextDouble() < 0.8)
                        {
                            type = MapTileType.OneWay;
                        }
                        else
                        {
                            type = MapTileType.Block;
                        }
                    }

                    row[x] = type;
                }
            }
        }

        public static async Task<Map> LoadMap(string path)
        {
            var mapData = await System.IO.File.ReadAllTextAsync(path);
            var map = Newtonsoft.Json.JsonConvert.DeserializeObject<Map>(mapData);

            return map;
        }

        public Vector GetTilePosAtPoint(Vector pt)
        {
            return new Vector(
                (float)Math.Floor((pt.X - Position.X + Constants.TileSize / 2f) / Constants.TileSize),
                (float)Math.Floor((pt.Y - Position.Y + Constants.TileSize / 2f) / Constants.TileSize)
            );
        }

        public int GetMapTileYAtPoint(float y)
        {
            return (int)Math.Floor((y - Position.Y + Constants.TileSize / 2f) / Constants.TileSize);
        }

        public int GetMapTileXAtPoint(float x)
        {
            return (int)Math.Floor((x - Position.X + Constants.TileSize / 2f) / Constants.TileSize);
        }

        public Vector GetMapTilePosition(float x, float y)
        {
            return new Vector(
                x * Constants.TileSize + Position.X,
                y * Constants.TileSize + Position.Y
            );
        }

        public MapTileType GetTile(int x, int y)
        {
            if (x < 0 || x >= Width || y < 0 || y >= Height)
                return MapTileType.Block;

            return Tiles[y][x];
        }

        public bool IsObstacle(int x, int y)
        {
            return GetTile(x, y) == MapTileType.Block;
        }

        public bool IsGround(int x, int y)
        {
            var tile = GetTile(x, y);
            return tile == MapTileType.Block || tile == MapTileType.OneWay;
        }

        public int GetBufferSize()
        {
            // Width (short), Height (short), data (1 byte per tile)
            return 2 + 2 + (Width * Height);
        }

        public void Serialize(ref byte[] buffer)
        {
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 0, 2), (ushort)Width);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 2, 2), (ushort)Height);
            int pos = 4;
            for (int y = 0; y < Height; y++)
            {
                for (int x = 0; x < Width; x++)
                {
                    buffer[pos] = (byte)Tiles[y][x];
                    pos++;
                }
            }
        }
    }
}
