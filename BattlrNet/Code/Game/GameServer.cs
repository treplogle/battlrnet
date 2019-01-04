using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace BattlrNet.Code.Game
{
    public interface IGameServer : IHostedService { }

    public class GameServer : BackgroundService, IGameServer
    {
        public string Name { get; set; } = "Battlr";
        public int MaxPlayers { get; set; } = 8;
        public double ThroughputMeasurementInterval { get; set; } = 5;

        private long bytesReceived = 0;
        public long BytesReceived { get { return bytesReceived; } }

        private long bytesSent = 0;
        public long BytesSent { get { return bytesSent; } }

        public double BytesReceivedPerSecond { get; private set; }
        public double BytesSentPerSecond { get; private set; }

        public ConcurrentDictionary<int, Player> Players { get; private set; } = new ConcurrentDictionary<int, Player>();

        private GameWorld gameWorld;

        private readonly object newPlayerLock = new object();
        private readonly BufferManager bufferManager;
        private readonly ILogger<GameServer> logger;
        private readonly ILogger<Player> playerLogger;
        private readonly IHostingEnvironment hostingEnvironment;

        private float serverTime;
        private float lastStateUpdate;

        private int nextID = 1;

        private System.Diagnostics.Stopwatch throughputTimer = System.Diagnostics.Stopwatch.StartNew();
        private long lastSent;
        private long lastReceived;

        private Timer timer;

        public GameServer(ILogger<GameServer> logger, ILogger<Player> playerLogger, BufferManager bufferManager, IHostingEnvironment hostingEnvironment)
        {
            this.logger = logger;
            this.playerLogger = playerLogger;
            this.bufferManager = bufferManager;
            this.hostingEnvironment = hostingEnvironment;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation($"**** GameServer is starting. ****");

            stoppingToken.Register(() => logger.LogDebug($"**** GameServer background task is stopping. ****"));

            gameWorld = new GameWorld(hostingEnvironment.ContentRootPath, 2);
            await gameWorld.LoadMap();

            InitHighFrequencyTimerGameLoop();

            while (!stoppingToken.IsCancellationRequested)
            {
                Thread.Sleep(1000);
            }

            gameLoop.Stop();

            logger.LogDebug($"**** GameServer background task is stopping. ****");
        }

        private float inputTime;
        private List<float> frameTimes = new List<float>(128);
        private float averageFrameTime = 0;
        private System.Diagnostics.Stopwatch frameTimer = System.Diagnostics.Stopwatch.StartNew();
        private TimeSpan lastFrameTime = TimeSpan.Zero;

        private void TimerTick(Object stateInfo)
        {
            var now = frameTimer.Elapsed;
            var elapsed = (float)(now - lastFrameTime).TotalSeconds;
            lastFrameTime = now;

            Update(elapsed);
        }

        private HighFrequencyTimer gameLoop;
        private int actualFps;
        private void InitHighFrequencyTimerGameLoop()
        {
            gameLoop = new HighFrequencyTimer(62.5, id => GameLoopTick(id), () => { }, () => { }, (fps) =>
            {
                actualFps = fps;
            });

            gameLoop.Start();
        }

        private void GameLoopTick(long id)
        {
            var now = frameTimer.Elapsed;
            var elapsed = (float)(now - lastFrameTime).TotalSeconds;
            lastFrameTime = now;

            Update(elapsed);
        }

        private void Update(float elapsed)
        {
            serverTime += elapsed;

            frameTimes.Add(elapsed * 1000);

            if (frameTimes.Count > 100)
            {
                //logger.LogInformation($"**** Avg Frametime: {frameTimes.Sum() / frameTimes.Count} ****");
                averageFrameTime = frameTimes.Sum() / frameTimes.Count;
                frameTimes.Clear();
            }

            inputTime += elapsed;

            gameWorld.Update(elapsed);

            var stateUpdate = new Messages.StateUpdate();
            stateUpdate.Players = Players.Select(x => x.Value).ToList();

            BroadcastMessage(stateUpdate);

            if (throughputTimer.Elapsed.TotalSeconds >= ThroughputMeasurementInterval)
            {
                BytesReceivedPerSecond = (BytesReceived - lastReceived) / throughputTimer.Elapsed.TotalSeconds;
                BytesSentPerSecond = (BytesSent - lastSent) / throughputTimer.Elapsed.TotalSeconds;
                throughputTimer.Restart();

                lastReceived = BytesReceived;
                lastSent = BytesSent;

                //logger.LogInformation($"**** Bytes received PS: {BytesReceivedPerSecond} ****");
                //logger.LogInformation($"**** Bytes sent PS: {BytesSentPerSecond} ****");
            }
        }
        
        public Player FindPlayer(WebSocket socket)
        {
            foreach (var player in Players)
            {
                if (player.Value.Socket == socket)
                    return player.Value;
            }

            return null;
        }

        public Player FindPlayer(int id)
        {
            if (Players.TryGetValue(id, out Player player))
                return player;

            return null;
        }

        private void SendDataAsync(WebSocket socket, byte[] data, int dataLength)
        {
            socket.SendAsync(new ArraySegment<byte>(data, 0, dataLength), WebSocketMessageType.Binary, true, CancellationToken.None);
            Interlocked.Add(ref bytesSent, dataLength);
        }

        private void SendDataAsync(WebSocket socket, Messages.IMessage message)
        {
            using (var buffer = bufferManager.GetBuffer())
            {
                int msgLen = message.ToBytes(buffer.Buffer);

                socket.SendAsync(new Memory<byte>(buffer.Buffer, 0, msgLen), WebSocketMessageType.Binary, true, CancellationToken.None);

                Interlocked.Add(ref bytesSent, msgLen);
            }
        }

        private void BroadcastMessage(Messages.IMessage message)
        {
            using (var buffer = bufferManager.GetBuffer())
            {
                int msgLen = message.ToBytes(buffer.Buffer);
                var mem = new Memory<byte>(buffer.Buffer, 0, msgLen);

                foreach (var player in Players)
                {
                    player.Value.Socket.SendAsync(mem, WebSocketMessageType.Binary, true, CancellationToken.None);
                    Interlocked.Add(ref bytesSent, msgLen);
                }
            }
        }

        public int NewConnection(WebSocket socket)
        {
            lock (newPlayerLock)
            {
                // TODO: Check bans
                if (Players.Count < MaxPlayers)
                {
                    var id = Interlocked.Increment(ref nextID);
                    Players.TryAdd(id, new Player(playerLogger, id, socket, gameWorld));
                    logger.LogInformation($"**** New player. Total Players: {Players.Count} ****");
                    return id;
                }
            }

            logger.LogInformation("**** Rejecting new player: too many players. ****");

            var joinReq = new Messages.JoinAccepted()
            {
                Accepted = false,
                RejectReason = Messages.JoinRejectedReason.TooManyPlayers
            };

            SendDataAsync(socket, joinReq);

            return -1;
        }

        public void ClosedConnection(WebSocket socket)
        {
            var player = FindPlayer(socket);
            if (player != null)
                ClosedConnection(player.PlayerId);
        }

        public void ClosedConnection(int id)
        {
            if (Players.TryRemove(id, out Player player))
            {
                player.Socket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure,
                                    statusDescription: "Closed by the server.",
                                    cancellationToken: CancellationToken.None).GetAwaiter().GetResult();

                logger.LogInformation($"**** Player disconnected. Total Players: {Players.Count} ****");
            }
        }

        public void ProcessCommand(int id, byte[] data, int length)
        {
            if (data == null || data.Length == 0 || length == 0)
            {
                logger.LogInformation("**** Received invalid message ****");
                return; // Invalid message.
            }

            Interlocked.Add(ref bytesReceived, length);
            //logger.LogInformation($"**** Bytes received: {BytesReceived} ****");

            var player = FindPlayer(id);
            if (player == null)
            {
                logger.LogInformation($"**** Invalid player ID: {id} ****");
                return; // Invalid player ID.
            }

            switch ((Messages.MessageType)data[0])
            {
                case Messages.MessageType.PlayerInput:
                    {
                        var msg = new Messages.PlayerInput();

                        if (length < msg.MinimumDataLength)
                        {
                            logger.LogDebug("**** Received PlayerInput without enough data ****");
                            return;
                        }

                        msg.FromBytes(data);
                        //logger.LogInformation($"**** Received player input for player {id}; seq: {msg.Sequence}, input: {msg.Input} ****");
                        player.AddNewInput(msg);
                        player.ReceivedNewInput = true;
                    }
                    break;
                case Messages.MessageType.PlayerInfoRequest:
                    {
                        var msg = new Messages.PlayerInfoRequest();

                        if (length < msg.MinimumDataLength)
                        {
                            logger.LogDebug("**** Received PlayerInfoRequest without enough data ****");
                            return;
                        }

                        msg.FromBytes(data);

                        if (Players.TryGetValue(msg.ID, out Player otherPlayer))
                        {
                            var info = new Messages.PlayerInfo
                            {
                                ID = msg.ID,
                                Name = otherPlayer.Name,
                                Color = otherPlayer.Color
                            };

                            SendDataAsync(player.Socket, info);
                        }

                        break;
                    }
                case Messages.MessageType.JoinRequest:
                    {
                        var msg = new Messages.JoinRequest();

                        if (length < msg.MinimumDataLength)
                        {
                            logger.LogDebug("**** Received JoinRequest without enough data ****");
                            return;
                        }

                        // TODO: Verify can join (check name for dupes?)

                        msg.FromBytes(data);
                        logger.LogInformation($"**** Received join request from {msg.Name} ****");

                        var joinReq = new Messages.JoinAccepted()
                        {
                            Accepted = true,
                            ID = (byte)id,
                            MapID = gameWorld.MapID,
                            Name = player.Name,
                            Color = player.Color
                        };

                        // TODO: This has to be threadsafe.
                        gameWorld.Players.Add(player);

                        SendDataAsync(player.Socket, joinReq);
                    }
                    break;
                case Messages.MessageType.Ping:
                    {
                        var msg = new Messages.Ping();

                        if (length < msg.MinimumDataLength)
                        {
                            logger.LogDebug("**** Received Ping without enough data ****");
                            return;
                        }

                        msg.FromBytes(data);

                        // Send back to player.
                        msg.AvgFrameTime = averageFrameTime;
                        SendDataAsync(player.Socket, msg);
                        
                        //logger.LogInformation($"**** Ping from player {id} ****");
                    }
                    break;
                default:
                    // Invalid message.
                    logger.LogInformation($"**** Received invalid message type: {data[0]} ****");
                    break;
            }
        }
    }
}
