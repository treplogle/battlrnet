using System;

namespace BattlrNet.Code.Game.Messages
{
    public enum MessageType : byte
    {
        JoinRequest = 1,
        JoinAccepted = 2,
        NewPlayerJoined = 3,
        PlayerInput = 4,
        PlayerState = 5,
        Position = 6,
        PlayerDisconnected = 7,
        Ping = 8,
        StateUpdate = 9,
        PlayerInfoRequest = 10,
        PlayerInfo = 11
    }
}
