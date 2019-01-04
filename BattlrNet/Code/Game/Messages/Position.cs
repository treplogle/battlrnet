using System;

namespace BattlrNet.Code.Game.Messages
{
    /// <summary>
    /// Broadcast from server at regular intervals to keep players synced.
    /// </summary>
    public class Position : IMessage
    {
        public MessageType MessageType => MessageType.Position;
        public int MinimumDataLength => 29;

        public int ID { get; set; }
        public float PositionX { get; set; }
        public float PositionY { get; set; }
        public float VelocityX { get; set; }
        public float VelocityY { get; set; }
        public int Tick { get; set; }
        public int Sequence { get; set; }
        
        public void FromBytes(byte[] data)
        {
            // Not sent from client.
        }

        public int ToBytes(byte[] buffer)
        {
            buffer[0] = (byte)MessageType;
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 1, 4), ID);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 5, 4), PositionX);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 9, 4), PositionY);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 13, 4), VelocityX);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 17, 4), VelocityY);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 21, 4), Tick);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 25, 4), Sequence);

            return MinimumDataLength;
        }
    }
}
