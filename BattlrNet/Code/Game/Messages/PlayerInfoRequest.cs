using System;

namespace BattlrNet.Code.Game.Messages
{
    public class PlayerInfoRequest : IMessage
    {
        public MessageType MessageType => MessageType.PlayerInfoRequest;
        public int MinimumDataLength => 2;

        public byte ID { get; set; }

        public void FromBytes(byte[] data)
        {
            ID = data[1];
        }

        // Not sent to client
        public int ToBytes(byte[] buffer)
        {
            return 0;
        }
    }
}
