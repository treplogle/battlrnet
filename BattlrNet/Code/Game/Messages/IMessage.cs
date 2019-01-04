using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BattlrNet.Code.Game.Messages
{
    public interface IMessage
    {
        MessageType MessageType { get; }
        int MinimumDataLength { get; }
        int ToBytes(byte[] buffer);
        void FromBytes(byte[] data);
    }
}
