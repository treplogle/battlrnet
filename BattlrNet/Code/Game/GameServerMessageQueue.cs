using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using System.Net.WebSockets;
using BattlrNet.Code.Game.Messages;
using Microsoft.Extensions.Logging;
using System.Threading;

namespace BattlrNet.Code.Game
{
    public class MessageQueueItem
    {
        #region Pool
        private static readonly ConcurrentBag<MessageQueueItem> pool = new ConcurrentBag<MessageQueueItem>();

        public static MessageQueueItem Get()
        {
            if (pool.Count > 0 && pool.TryTake(out MessageQueueItem item))
            {
                item.Reset();
                return item;
            }

            return new MessageQueueItem();
        }

        #endregion Pool

        public WebSocket Socket { get; set; }
        public IMessage Message { get; set; }

        public void Reset()
        {
            Socket = null;
            Message = null;
        }

        public void ReturnToPool()
        {
            pool.Add(this);
            Reset();
        }
    }

    public class GameServerMessageQueue
    {
        public ConcurrentQueue<WebSocket> NewConnectionsQueue { get; private set; } = new ConcurrentQueue<WebSocket>();
        public ConcurrentQueue<WebSocket> ClosedConnectionsQueue { get; private set; } = new ConcurrentQueue<WebSocket>();
        public ConcurrentQueue<MessageQueueItem> MessageQueue { get; private set; } = new ConcurrentQueue<MessageQueueItem>();

        private long bytesReceived = 0;
        public long BytesReceived { get { return bytesReceived; } }

        ILogger<GameServerMessageQueue> logger;

        public GameServerMessageQueue(ILogger<GameServerMessageQueue> logger)
        {
            this.logger = logger;
        }

        public void NewConnection(WebSocket socket)
        {
            NewConnectionsQueue.Enqueue(socket);
        }

        public void ClosedConnection(WebSocket socket)
        {
            ClosedConnectionsQueue.Enqueue(socket);
        }

        public void NewCommand(WebSocket socket, byte[] data, int length)
        {
            if (data == null || data.Length == 0 || length == 0)
            {
                logger.LogInformation("**** Received invalid message ****");
                return; // Invalid message.
            }

            Interlocked.Add(ref bytesReceived, length);
            MessageQueueItem msgItem;
            
            switch ((MessageType)data[0])
            {
                case MessageType.JoinRequest:
                    {
                        var msg = new JoinRequest();

                        if (length < msg.MinimumDataLength)
                        {
                            logger.LogDebug("**** Received JoinRequest without enough data ****");
                            return;
                        }

                        msg.FromBytes(data);
                        logger.LogInformation($"**** Received join request from {msg.Name} ****");

                        msgItem = MessageQueueItem.Get();
                        msgItem.Socket = socket;
                        msgItem.Message = msg;

                        MessageQueue.Enqueue(msgItem);
                    }
                    break;
                case MessageType.JoinAccepted:
                    break;
                case MessageType.NewPlayerJoined:
                    break;
                case MessageType.PlayerInput:
                    {
                        var msg = new Messages.PlayerInput();

                        if (length < msg.MinimumDataLength)
                        {
                            logger.LogDebug("**** Received PlayerInput without enough data ****");
                            return;
                        }

                        msg.FromBytes(data);
                        logger.LogInformation($"**** Received player input: {msg.Sequence} = {msg.Input} ****");

                        msgItem = MessageQueueItem.Get();
                        msgItem.Socket = socket;
                        msgItem.Message = msg;

                        MessageQueue.Enqueue(msgItem);
                    }
                    break;
                case MessageType.PlayerState:
                    break;
                case MessageType.Position:
                    break;
                case MessageType.Ping:

                    break;
                default:
                    // Invalid message.
                    logger.LogInformation($"**** Received invalid message type: {data[0]} ****");
                    break;
            }
        }
    }
}
