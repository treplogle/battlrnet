using System;
using System.Text;

namespace BattlrNet.Code.Game.Messages
{
    /// <summary>
    /// Sent from player to server when requesting to join the game.
    /// </summary>
    public struct JoinRequest : IMessage
    {
        public const int MaxNameLength = 25;

        public MessageType MessageType => MessageType.JoinRequest;
        public int MinimumDataLength => 3;

        public string Name { get; set; }

        public void FromBytes(byte[] data)
        {
            // MessageType = data[0]

            int length = Math.Min((int)data[1], MaxNameLength * 2); // 2 bytes per character

            Name = Encoding.Unicode.GetString(data, 2, Math.Min(length, data.Length - 2));
        }

        public int ToBytes(byte[] buffer)
        {
            buffer[0] = (byte)MessageType;

            int length = Encoding.Unicode.GetBytes(Name, 0, Math.Min(Name.Length, MaxNameLength), buffer, 2);
            buffer[1] = (byte)length;

            return length + 2;
        }
    }
}
