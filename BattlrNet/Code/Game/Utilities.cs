using System;
using System.Collections.Generic;

namespace BattlrNet.Code.Game
{
    public static class Utilities
    {
        private static readonly Random random = new Random();

        public static Vector Round(Vector v)
        {
            return new Vector(Round(v.X), Round(v.Y));
        }

        public static float Round(double v)
        {
            return (float)Math.Round(v, Constants.NetworkPrecision);
        }

        public static T GetRandomListItem<T>(IList<T> list)
        {
            if (list == null || list.Count == 0)
                return default(T);

            return list[random.Next(list.Count)];
        }
    }
}
