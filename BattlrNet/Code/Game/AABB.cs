using System;

namespace BattlrNet.Code.Game
{
    public class AABB
    {
        public Vector Center;
        public Vector HalfSize;

        public AABB(Vector center, Vector halfSize)
        {
            Center = center;
            HalfSize = halfSize;
        }

        public bool Overlaps(AABB other)
        {
            if (Math.Abs(Center.X - other.Center.X) > this.HalfSize.X + other.HalfSize.X) return false;
            if (Math.Abs(Center.Y - other.Center.Y) > this.HalfSize.Y + other.HalfSize.Y) return false;
            return true;
        }

        public Vector GetSize()
        {
            return new Vector(HalfSize.X * 2, HalfSize.Y * 2);
        }
    }
}
