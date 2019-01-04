using System;

namespace BattlrNet.Code.Game.Messages
{
    public class PlayerInfo : IMessage
    {
        public MessageType MessageType => MessageType.PlayerInfo;
        public int MinimumDataLength => 6;

        public byte ID { get; set; }
        public Color Color { get; set; }
        public string Name { get; set; }

        // Not sent from client.
        public void FromBytes(byte[] data) { }

        public int ToBytes(byte[] buffer)
        {
            buffer[0] = (byte)MessageType;

            buffer[1] = ID;
            buffer[2] = Color.R;
            buffer[3] = Color.G;
            buffer[4] = Color.B;

            int length = System.Text.Encoding.Unicode.GetBytes(Name, 0, Math.Min(Name.Length, 50), buffer, 6);
            buffer[5] = (byte)length;

            return MinimumDataLength + length;
        }
    }
}
