using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace BattlrNet.Code.Game
{
    public class Player
    {
        public int PlayerId;
        public WebSocket Socket;
        public string Name;
        public Color Color = Color.Random(100, 255);

        public Vector Position;
        public Vector Velocity;
        public Vector Scale = Vector.One;
        public Vector AabbOffset = Vector.Zero;
        public AABB Aabb;

        public Queue<Messages.PlayerInput> InputsToProcess = new Queue<Messages.PlayerInput>();
        public int InputQueueDelay = 5;
        public InputTypes CurrentInput = InputTypes.None;
        public int LastSequence;
        public int ClientTick;
        public bool ReceivedNewInput;

        private Vector maxVelocity = new Vector(Constants.DefaultWalkSpeed, Constants.MaxFallSpeed);
        private float jumpSpeed = Constants.DefaultJumpSpeed;
        private float accel = Constants.DefaultAccel;
        private float decel = Constants.DefaultDecel;

        private Vector oldPosition;
        private Vector oldSpeed;
        private bool onGround = false;

        private bool moveRight = false;
        private bool moveLeft = false;
        private bool moveDown = false;
        private bool jumping = false;
        private bool running = false;
        private bool lastJump = false;
        private bool lastDown = false;

        private bool pushedRightWall = false;
        private bool pushesRightWall = false;
        private bool pushedLeftWall = false;
        private bool pushesLeftWall = false;
        private bool wasOnGround = false;
        private bool wasAtCeiling = false;
        private bool atCeiling = false;
        private bool onOneWayPlatform = false;

        private GroundCheckResults groundCheckResults = new GroundCheckResults();

        private ILogger<Player> logger;
        private GameWorld gameWorld;
        private Map map;
        
        public Player(ILogger<Player> logger, int playerId, WebSocket socket, GameWorld gameWorld)
        {
            this.logger = logger;
            PlayerId = playerId;
            Socket = socket;
            this.gameWorld = gameWorld;
            map = gameWorld.Map;

            Name = Data.GetRandomName();

            // TODO: Temporary. Use spawn position from map.
            Position.X = Constants.TileSize * 30;
            Position.Y = Constants.TileSize * 38;
            
            Aabb = new AABB(Position + AabbOffset, new Vector(Constants.TileSize * 0.5f * 0.8f, Constants.TileSize * 0.5f * 1.5f));
        }

        public void AddNewInput(Messages.PlayerInput input)
        {
            InputQueueDelay--;
            InputsToProcess.Enqueue(input);
        }

        public void Update(float elapsed)
        {
            if (InputQueueDelay > 0)
            {
                // Still waiting on initial buffer fill.
                // Want a few inputs buffered so we don't get missed frames.
                return;
            }
            
            if (InputsToProcess.TryDequeue(out Messages.PlayerInput inputMsg))
            {
                LastSequence = inputMsg.Sequence;
                CurrentInput = inputMsg.Input;
            }
            else
            {
                // We couldn't get an input from the buffer. Client is probably lagging really bad.
                // Just run physics with the last input.
            }

            UpdatePlayer(elapsed);
        }

        private void UpdatePlayer(float elapsed)
        {
            if (CurrentInput.HasFlag(InputTypes.Right))
            {
                moveRight = true;
                moveLeft = false;
            }
            else if (CurrentInput.HasFlag(InputTypes.Left))
            {
                moveRight = false;
                moveLeft = true;
            }
            else
            {
                moveRight = false;
                moveLeft = false;
            }

            if (CurrentInput.HasFlag(InputTypes.Run))
                running = true;
            else
                running = false;

            if (CurrentInput.HasFlag(InputTypes.Jump))
            {
                if (!lastJump)
                {
                    jumping = true;
                    lastJump = true;
                }
            }
            else
            {
                jumping = false;
                lastJump = false;
            }

            if (CurrentInput.HasFlag(InputTypes.Down))
            {
                if (!lastDown)
                {
                    moveDown = true;
                    lastDown = true;
                }
            }
            else
            {
                moveDown = false;
                lastDown = false;
            }

            if (elapsed > 0)
                UpdatePhysics(elapsed);
        }

        private void UpdatePhysics(float elapsed)
        {
            oldPosition = Position;
            oldSpeed = Velocity;

            wasOnGround = onGround;
            pushedRightWall = pushesRightWall;
            pushedLeftWall = pushesLeftWall;
            wasAtCeiling = atCeiling;

            var max = running ? maxVelocity.X * 1.5f : maxVelocity.X;
            float accel;

            if (moveRight && Velocity.X < max)
            {
                if (Velocity.X < 0) { accel = this.decel; }
                else { accel = this.accel; }

                Velocity.X += accel * elapsed;

                if (Velocity.X > max)
                {
                    Velocity.X = max;
                }
            }
            else if (moveLeft && Velocity.X > -max)
            {
                if (Velocity.X > 0) { accel = this.decel; }
                else { accel = this.accel; }

                Velocity.X -= accel * elapsed;

                if (Velocity.X < -max)
                {
                    Velocity.X = -max;
                }
            }
            else if (Velocity.X > 0)
            {
                Velocity.X -= decel * elapsed;
                if (Velocity.X < 0)
                {
                    Velocity.X = 0;
                }
            }
            else if (Velocity.X < 0)
            {
                Velocity.X += decel * elapsed;
                if (Velocity.X > 0)
                {
                    Velocity.X = 0;
                }
            }

            //if (moveRight)
            //    Velocity.X = maxVelocity.X;
            //else if (moveLeft)
            //    Velocity.X = -maxVelocity.X;
            //else
            //    Velocity.X = 0;
            

            // TODO: Less agility in the air.

            if (jumping && onGround)
            {
                Velocity.Y = jumpSpeed;
            }
            else
            {
                Velocity.Y += Constants.Gravity * elapsed;
            }

            jumping = false;

            Position += Velocity * elapsed;

            var oldCenter = oldPosition + AabbOffset;
            var center = Position + AabbOffset;
            float? rightWallX = null;
            float? leftWallX = null;

            if (Velocity.X <= 0)
            {
                leftWallX = CheckLeft(oldCenter, center);
                if (leftWallX != null)
                {
                    if (oldPosition.X - Aabb.HalfSize.X + AabbOffset.X >= leftWallX)
                    {
                        Position.X = leftWallX.Value + Aabb.HalfSize.X - AabbOffset.X;
                        pushesLeftWall = true;
                    }

                    Velocity.X = Math.Max(Velocity.X, 0);
                }
                else
                {
                    pushesLeftWall = false;
                }
            }
            else
            {
                pushesLeftWall = false;
            }

            if (Velocity.Y >= 0 && CheckGround(oldCenter, center, groundCheckResults))
            {
                Position.Y = groundCheckResults.GroundY - Aabb.HalfSize.Y - AabbOffset.Y;
                onOneWayPlatform = groundCheckResults.OnOneWayPlatform;
                Velocity.Y = 0;
                onGround = true;
            }
            else
            {
                onGround = false;
                onOneWayPlatform = false;
            }

            atCeiling = false;
            if (Velocity.Y <= 0)
            {
                var ceilingY = CheckCeiling(oldCenter, center);
                if (ceilingY != null)
                {
                    atCeiling = true;
                    Position.Y = ceilingY.Value + Aabb.HalfSize.Y - AabbOffset.Y + 1;
                    Velocity.Y = 0;
                }
            }

            if (moveDown && onOneWayPlatform)
            {
                Position.Y += Constants.OneWayPlatformThreshold + 1;
            }
            else
            {
                moveDown = false;
            }

            // TODO: Temporary ground collision.
            //if (Position.Y > 3128)
            //{
            //    Velocity.Y = 0;
            //    Position.Y = 3128;
            //}

            // Round floating point values to help with network reconciliation.
            Velocity = Utilities.Round(Velocity);
            Position = Utilities.Round(Position);

            Aabb.Center = Position + AabbOffset;
        }

        private bool CheckGround(Vector oldCenter, Vector center, GroundCheckResults groundCheckResults)
        {
            groundCheckResults.OnOneWayPlatform = false;
            groundCheckResults.OnGround = false;
            groundCheckResults.GroundY = 0;

            var oldBottomLeft = new Vector(
                oldCenter.X - Aabb.HalfSize.X + Vector.Right.X,
                oldCenter.Y + Aabb.HalfSize.Y + Vector.Down.Y
            ).Round();

            var newBottomLeft = new Vector(
                center.X - Aabb.HalfSize.X + Vector.Right.X,
                center.Y + Aabb.HalfSize.Y + Vector.Down.Y
            ).Round();

            var endY = map.GetMapTileYAtPoint(newBottomLeft.Y);
            var begY = Math.Min(map.GetMapTileYAtPoint(oldBottomLeft.Y) + 1, endY);
            var dist = Math.Max(Math.Abs(endY - begY), 1);

            var checkedTile = new Vector();
            var bottomLeft = new Vector();
            var bottomRight = new Vector();

            int tileIndexX;
            MapTileType tile;

            for (var tileIndexY = begY; tileIndexY <= endY; tileIndexY++)
            {
                Vector.Lerp(oldBottomLeft, newBottomLeft, Math.Abs(endY - tileIndexY) / dist, ref bottomLeft);
                bottomRight.X = bottomLeft.X + Aabb.HalfSize.X * 2 - 2;
                bottomRight.Y = bottomLeft.Y;

                checkedTile = bottomLeft;

                while (true)
                {
                    checkedTile.X = Math.Min(checkedTile.X, bottomRight.X);

                    tileIndexX = map.GetMapTileXAtPoint(checkedTile.X);
                    tile = map.GetTile(tileIndexX, tileIndexY);

                    groundCheckResults.GroundY = tileIndexY * Constants.TileSize - Constants.TileSize / 2 + map.Position.Y;

                    if (tile == MapTileType.Block)
                    {
                        groundCheckResults.OnGround = true;
                        groundCheckResults.OnOneWayPlatform = false;
                        return true;
                    }
                    else if (tile == MapTileType.OneWay
                      && Math.Abs(checkedTile.Y - groundCheckResults.GroundY) <= Constants.OneWayPlatformThreshold + (Position.Y - oldPosition.Y))
                    {
                        groundCheckResults.OnOneWayPlatform = true;
                    }

                    if (checkedTile.X >= bottomRight.X)
                    {
                        if (groundCheckResults.OnOneWayPlatform)
                        {
                            return true;
                        }

                        break;
                    }

                    checkedTile.X += Constants.TileSize;
                }
            }

            return false;
        }

        private float? CheckCeiling(Vector oldCenter, Vector center)
        {
            var oldTopRight = new Vector(
                oldCenter.X + Aabb.HalfSize.X - Vector.Right.X,
                oldCenter.Y - Aabb.HalfSize.Y + Vector.Up.Y
            ).Round();

            var newTopRight = new Vector(
                center.X + Aabb.HalfSize.X - Vector.Right.X,
                center.Y - Aabb.HalfSize.Y + Vector.Up.Y
            ).Round();

            var endY = map.GetMapTileYAtPoint(newTopRight.Y);
            var begY = Math.Max(map.GetMapTileYAtPoint(oldTopRight.Y) - 1, endY);
            var dist = Math.Max(Math.Abs(endY - begY), 1);

            var checkedTile = new Vector();
            var topLeft = new Vector();
            var topRight = new Vector();

            int tileIndexX;
            MapTileType tile;

            for (var tileIndexY = begY; tileIndexY >= endY; tileIndexY--)
            {
                Vector.Lerp(oldTopRight, newTopRight, Math.Abs(endY - tileIndexY) / dist, ref topRight);
                topLeft.X = topRight.X - Aabb.HalfSize.X * 2 + 2;
                topLeft.Y = topRight.Y;

                checkedTile = topLeft;

                while (true)
                {
                    checkedTile.X = Math.Min(checkedTile.X, topRight.X);
                    tileIndexX = map.GetMapTileXAtPoint(checkedTile.X);
                    tile = map.GetTile(tileIndexX, tileIndexY);

                    if (tile == MapTileType.Block)
                        return tileIndexY * Constants.TileSize + Constants.TileSize / 2 + map.Position.Y;

                    if (checkedTile.X >= topRight.X)
                        break;

                    checkedTile.X += Constants.TileSize;
                }
            }

            return null;
        }

        private float? CheckLeft(Vector oldCenter, Vector center)
        {
            var oldBottomLeft = new Vector(
                oldCenter.X - Aabb.HalfSize.X - 1,
                oldCenter.Y + Aabb.HalfSize.Y - 1
            ).Round();

            var newBottomLeft = new Vector(
                center.X - Aabb.HalfSize.X - 1,
                center.Y + Aabb.HalfSize.Y - 1
            ).Round();

            var endX = map.GetMapTileXAtPoint(newBottomLeft.X);
            var begX = Math.Max(map.GetMapTileXAtPoint(oldBottomLeft.X) - 1, endX);
            var dist = Math.Max(Math.Abs(endX - begX), 1);

            var checkedTile = new Vector();
            var bottomLeft = new Vector();
            var topLeft = new Vector();

            int tileIndexY;
            MapTileType tile;

            for (var tileIndexX = begX; tileIndexX >= endX; tileIndexX--)
            {
                Vector.Lerp(oldBottomLeft, newBottomLeft, Math.Abs(endX - tileIndexX) / dist, ref bottomLeft);
                topLeft.X = bottomLeft.X;
                topLeft.Y = bottomLeft.Y - Aabb.HalfSize.Y * 2 + 2;

                checkedTile = bottomLeft;

                while (true)
                {
                    checkedTile.Y = Math.Max(checkedTile.Y, topLeft.Y);

                    tileIndexY = map.GetMapTileYAtPoint(checkedTile.Y);
                    tile = map.GetTile(tileIndexX, tileIndexY);

                    if (tile == MapTileType.Block)
                    {
                        return tileIndexX * Constants.TileSize + Constants.TileSize / 2 + map.Position.X;
                    }

                    checkedTile.Y -= Constants.TileSize;

                    if (checkedTile.Y <= topLeft.Y)
                    {
                        break;
                    }
                }
            }

            return null;
        }

        private class GroundCheckResults
        {
            public bool OnGround;
            public bool OnOneWayPlatform;
            public float GroundY;
        }
    }
}
