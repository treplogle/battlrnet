using System;

namespace BattlrNet.Code.Game.Messages
{
    /// <summary>
    /// Sent from player to server when player activates an input (jump, move, etc.)
    /// </summary>
    public struct PlayerInput : IMessage
    {
        public MessageType MessageType => MessageType.PlayerInput;
        public int MinimumDataLength => 7;

        public InputTypes Input { get; set; }
        public int Sequence { get; set; }

        public bool Right => Input.HasFlag(InputTypes.Right);
        public bool Left => Input.HasFlag(InputTypes.Left);
        public bool Up => Input.HasFlag(InputTypes.Up);
        public bool Down => Input.HasFlag(InputTypes.Down);
        public bool Jump => Input.HasFlag(InputTypes.Jump);
        public bool Shift => Input.HasFlag(InputTypes.Run);

        public void FromBytes(byte[] data)
        {
            // MessageType = data[0]
            Input = (InputTypes)BitConverter.ToUInt16(data, 1);
            Sequence = BitConverter.ToInt32(data, 3);
        }

        public int ToBytes(byte[] buffer)
        {
            buffer[0] = (byte)MessageType;
            
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 1, 2), (ushort)Input);
            BitConverter.TryWriteBytes(new Span<byte>(buffer, 3, 4), Sequence);

            return MinimumDataLength;
        }
    }
}
