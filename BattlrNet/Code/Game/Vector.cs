using System;

namespace BattlrNet.Code.Game
{
    public struct Vector
    {
        public float X;
        public float Y;

        public Vector(float x, float y)
        {
            X = x;
            Y = y;
        }

        public Vector Round()
        {
            return new Vector((float)Math.Round(X), (float)Math.Round(Y));
        }

        public float Length()
        {
            return (float)Math.Sqrt(X * X + Y * Y);
        }

        public float LengthSquared()
        {
            return X * X + Y * Y;
        }

        public static void Lerp(Vector a, Vector b, float t, ref Vector result)
        {
            result.X = a.X + t * (b.X - a.X);
            result.Y = a.Y + t * (b.Y - a.Y);
        }

        public static Vector Lerp(Vector a, Vector b, float t)
        {
            var v = new Vector();
            Lerp(a, b, t, ref v);
            return v;
        }

        public static Vector operator +(Vector a, Vector b)
        {
            return new Vector(a.X + b.X, a.Y + b.Y);
        }

        public static Vector operator -(Vector a, Vector b)
        {
            return new Vector(a.X - b.X, a.Y - b.Y);
        }

        public static Vector operator *(Vector a, float v)
        {
            return new Vector(a.X * v, a.Y * v);
        }

        public static Vector operator /(Vector a, float v)
        {
            return new Vector(a.X / v, a.Y / v);
        }

        public static readonly Vector Zero = new Vector(0, 0);
        public static readonly Vector One = new Vector(1, 1);
        public static readonly Vector Right = new Vector(1, 0);
        public static readonly Vector Left = new Vector(-1, 0);
        public static readonly Vector Up = new Vector(0, -1);
        public static readonly Vector Down = new Vector(0, 1);
    }
}
