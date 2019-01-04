using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BattlrNet.Code.Game
{
    public class GameWorld
    {
        public List<Player> Players { get; private set; } = new List<Player>();
        public Map Map { get; private set; }
        public int MapID { get; private set; }

        private readonly string contentRootPath;

        public GameWorld(string contentRootPath, int mapID)
        {
            this.contentRootPath = contentRootPath;
            MapID = mapID;
        }

        public async Task LoadMap()
        {
            Map = await Map.LoadMap($"{contentRootPath}/wwwroot/maps/{MapID}.json");
        }

        public void Update(float elapsed)
        {
            foreach (var player in Players)
            {
                //player.Update(elapsed);
                player.Update(0.016f);

                // Too much elapsed time, do another update.
                if (elapsed >= 0.03f)
                    player.Update(0.016f);

                player.Velocity = Utilities.Round(player.Velocity);
                player.Position = Utilities.Round(player.Position);
            }
        }
    }
}
