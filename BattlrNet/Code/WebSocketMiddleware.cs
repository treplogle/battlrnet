using BattlrNet.Code.Game;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace BattlrNet.Code
{
    public class WebSocketMiddleware
    {
        private RequestDelegate next;
        private readonly BufferManager bufferManager;
        private readonly ILogger<WebSocketMiddleware> logger;
        private readonly GameServer gameServer;
        
        public WebSocketMiddleware(RequestDelegate next, BufferManager bufferManager, Microsoft.Extensions.Hosting.IHostedService gameServer, ILogger<WebSocketMiddleware> logger)
        {
            this.next = next;
            this.bufferManager = bufferManager;
            this.logger = logger;
            this.gameServer = gameServer as GameServer;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                await next.Invoke(context);
                return;
            }

            var socket = await context.WebSockets.AcceptWebSocketAsync();
            var playerID = gameServer.NewConnection(socket);

            await Receive(socket);

            GC.Collect();
        }

        private async Task Receive(WebSocket socket)
        {
            var playerID = gameServer.FindPlayer(socket)?.PlayerId ?? 0;

            if (playerID <= 0)
            {
                logger.LogInformation($"#### Invalid player ID: {playerID} ####");
                return;
            }

            logger.LogInformation($"#### Receiving for ID: {playerID} ####");

            using (var buffer = bufferManager.GetBuffer())
            {
                try
                {
                    var result = await socket.ReceiveAsync(buffer.Buffer, CancellationToken.None);
                    while (!result.CloseStatus.HasValue)
                    {
                        HandleMessage(result, playerID, buffer.Buffer);
                        result = await socket.ReceiveAsync(buffer.Buffer, CancellationToken.None);
                    }

                    gameServer.ClosedConnection(playerID);
                }
                catch (Exception)
                {

                }
            }
        }

        private void HandleMessage(WebSocketReceiveResult result, int playerID, byte[] data)
        {
            // We received data from the client.
            if (result.MessageType == WebSocketMessageType.Close)
            {
                gameServer.ClosedConnection(playerID);
                return;
            }

            gameServer.ProcessCommand(playerID, data, result.Count);
        }
    }
}
