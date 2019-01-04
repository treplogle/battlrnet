using System;
using System.Collections.Generic;

namespace BattlrNet.Code.Game.Messages
{
    /// <summary>
    /// Broadcast from server at regular intervals to keep world synced on clients.
    /// </summary>
    public class StateUpdate : IMessage
    {
        public MessageType MessageType => MessageType.StateUpdate;
        public int MinimumDataLength => 1;

        // Players
        //   ID, Position, Velocity, Sequence
        public List<Player> Players { get; set; }

        public void FromBytes(byte[] data)
        {
            // Not sent from client.
        }

        public int ToBytes(byte[] buffer)
        {
            buffer[0] = (byte)MessageType;
            buffer[1] = (byte)Players.Count;

            int index = 2;
            foreach (var player in Players)
            {
                buffer[index] = (byte)player.PlayerId;

                BitConverter.TryWriteBytes(new Span<byte>(buffer, index + 1, 4), player.Position.X);
                BitConverter.TryWriteBytes(new Span<byte>(buffer, index + 5, 4), player.Position.Y);
                BitConverter.TryWriteBytes(new Span<byte>(buffer, index + 9, 4), player.Velocity.X);
                BitConverter.TryWriteBytes(new Span<byte>(buffer, index + 13, 4), player.Velocity.Y);
                BitConverter.TryWriteBytes(new Span<byte>(buffer, index + 17, 4), player.LastSequence);

                index += 21;
            }

            return (Players.Count * 21) + 2;
        }
    }
}
