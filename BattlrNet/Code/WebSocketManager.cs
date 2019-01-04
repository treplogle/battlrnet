using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BattlrNet.Code
{
    public class GameSocketManager
    {
        private static ConcurrentDictionary<string, WebSocket> sockets = new ConcurrentDictionary<string, WebSocket>();

        private readonly ILogger<GameSocketManager> logger;

        public GameSocketManager(ILogger<GameSocketManager> logger)
        {
            this.logger = logger;
        }

        public WebSocket GetSocketById(string id)
        {
            if (sockets.TryGetValue(id, out WebSocket value))
                return value;

            return null;
        }

        public ConcurrentDictionary<string, WebSocket> GetAll()
        {
            return sockets;
        }

        public string GetId(WebSocket socket)
        {
            return sockets.FirstOrDefault(p => p.Value == socket).Key;
        }

        public string AddSocket(WebSocket socket)
        {
            var id = CreateConnectionId();
            sockets.TryAdd(id, socket);

            logger.LogInformation($"Added websocket. Current: {sockets.Count}");

            return id;
        }

        public async Task RemoveSocket(string id)
        {
            if (sockets.TryRemove(id, out WebSocket socket))
            {
                await socket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure,
                                        statusDescription: "Closed by the WebSocketManager",
                                        cancellationToken: CancellationToken.None);

                logger.LogInformation($"Removed websocket. Remaining: {sockets.Count}");
            }
        }

        private string CreateConnectionId()
        {
            return Guid.NewGuid().ToString();
        }

        public async Task SendMessageToAllAsync(string message)
        {
            foreach (var pair in sockets)
            {
                if (pair.Value.State == WebSocketState.Open)
                    await SendMessageAsync(pair.Value, message);
            }
        }

        private async Task SendDataAsync(WebSocket socket, byte[] data)
        {
            if (socket.State != WebSocketState.Open)
                return;

            await socket.SendAsync(buffer: new ArraySegment<byte>(data, 0, data.Length),
                                   messageType: WebSocketMessageType.Binary,
                                   endOfMessage: true,
                                   cancellationToken: CancellationToken.None);
        }

        private async Task SendMessageAsync(WebSocket socket, string message)
        {
            if (socket.State != WebSocketState.Open)
                return;

            var bytes = Encoding.ASCII.GetBytes(message);
            await socket.SendAsync(buffer: new ArraySegment<byte>(bytes, 0, bytes.Length),
                                   messageType: WebSocketMessageType.Text,
                                   endOfMessage: true,
                                   cancellationToken: CancellationToken.None);
        }
    }
}
