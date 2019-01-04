using System;

namespace BattlrNet.Code.Game.Messages
{
    public class Ping : IMessage
    {
        public MessageType MessageType => MessageType.Ping;
        public int MinimumDataLength => 9;

        public int ID { get; set; }
        public float AvgFrameTime { get; set; }

        public void FromBytes(byte[] data)
        {
            // MessageType = data[0]
            ID = data[1];
        }

        public int ToBytes(byte[] buffer)
        {
            buffer[0] = (byte)MessageType;
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 1, 4), ID);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 5, 4), AvgFrameTime);

            return MinimumDataLength;
        }
    }
}
