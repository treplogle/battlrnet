using System;

namespace BattlrNet.Code.Game
{
    public struct Color
    {
        private static Random random = new Random();

        public byte R;
        public byte G;
        public byte B;

        public Color(byte r, byte g, byte b)
        {
            R = r; G = g; B = b;
        }

        public static Color Random(byte min, byte max)
        {
            return new Color(
                (byte)random.Next(min, max),
                (byte)random.Next(min, max),
                (byte)random.Next(min, max)
            );
        }
    }
}
