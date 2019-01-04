using System;

namespace BattlrNet.Code.Game.Messages
{
    public enum JoinRejectedReason : byte
    {
        Unknown = 0,
        TooManyPlayers = 1,
        NameInUse = 2,
        Banned = 3
    }

    /// <summary>
    /// Sent from server to player if join request was accepted.
    /// </summary>
    public struct JoinAccepted : IMessage
    {
        public MessageType MessageType => MessageType.JoinAccepted;
        public int MinimumDataLength => 13;

        public bool Accepted { get; set; }
        public JoinRejectedReason RejectReason { get; set; }
        public bool IsLittleEndian { get; set; }
        public byte ID { get; set; }
        public int MapID { get; set; }
        public Color Color { get; set; }
        public string Name { get; set; }

        // This isn't used on the server.
        public void FromBytes(byte[] data) { }

        public int ToBytes(byte[] buffer)
        {
            buffer[0] = (byte)MessageType;
            buffer[1] = (byte)(Accepted ? 1 : 0);
            buffer[2] = (byte)RejectReason;
            buffer[3] = (byte)(BitConverter.IsLittleEndian ? 1 : 0);
            buffer[4] = ID;

            BitConverter.TryWriteBytes(new Span<byte>(buffer, 5, 4), MapID);

            buffer[9] = Color.R;
            buffer[10] = Color.G;
            buffer[11] = Color.B;

            int length = System.Text.Encoding.Unicode.GetBytes(Name, 0, Math.Min(Name.Length, 50), buffer, 13);
            buffer[12] = (byte)length;

            return MinimumDataLength + length;
        }
    }
}
