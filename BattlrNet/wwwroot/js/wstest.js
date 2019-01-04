const action = {
    left: 0,
    right: 1,
    up: 2,
    down: 3,
    jump: 4
};

let debugRun = true;

SystemJS.config({});
let input;
SystemJS.import("InputManager").then((a) => {
    input = new a.default();

    input.addInputAction(action.left, [65, 37]);
    input.addInputAction(action.right, [68, 39]);
    input.addInputAction(action.up, [87, 38]);
    input.addInputAction(action.down, [83, 40]);
    input.addInputAction(action.jump, [32]);
});

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let socketReady = false;
let socket;
let playerID, lilEndian;
let clientTime = 0, inputSequence = 0;
let delay = 0.1, serverTime = 0, pingID = 0;
let pingTime, lastPing = window.performance.now();
let lastSentInput = 0;

const inputHistory = [];

const scheme = document.location.protocol === "https:" ? "wss" : "ws";
const port = document.location.port ? (":" + document.location.port) : "";
const connectionUrl = scheme + "://" + document.location.hostname + port;

let player = {
    x: Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1),
    y: Math.random() * (canvas.height * 0.8) + (canvas.height * 0.1)
}

function onReady() {
    socketReady = true;
    update();
}

function connect() {
    console.log("connecting...");

    socket = new WebSocket(connectionUrl);
    socket.binaryType = 'arraybuffer';

    socket.onopen = function (event) {
        console.log("connected");
        // Send join request.
        const name = "Dude " + Math.round(Math.random() * 9999);
        
        const buffer = new ArrayBuffer((name.length * 2) + 2); // 2 bytes for each char
        const view = new Uint8Array(buffer);

        view[0] = 1; // Message type (JoinRequest)
        view[1] = (name.length * 2);

        str2ab(name, buffer, 2);
        
        socket.send(buffer);

        onReady();
    };

    socket.onclose = function (event) {
        console.log("disconnected");
    };

    socket.onerror = function (event) {
        console.error("connection error");
    };

    socket.onmessage = function (event) {
        handleMessage(event.data);
    };
};

connect();

let lastUpdate = window.performance.now();

function getElaspedTime() {
    let now = window.performance.now();

    const elapsed = (now - lastUpdate) / 1000;
    lastUpdate = now;
    return elapsed;
}

function update() {
    const elapsed = getElaspedTime();

    clientTime += elapsed;
    serverTime += elapsed;

    updateInput(elapsed);
    draw();

    const now = window.performance.now();
    if (now - lastPing > 5000) {
        lastPing = now;
        ping();
    }

    requestAnimationFrame(update);
}

// 00000000
//   SRLUDJ
// Shift-Right-Left-Up-Down-Jump

const JUMP = 1;
const DOWN = 2;
const UP = 4;
const LEFT = 8;
const RIGHT = 16;
const SHIFT = 32;

function updateInput(elapsed) {
    if (typeof (input) === "undefined") {
        return;
    }

    input.update(elapsed);

    let speedX = 0, speedY = 0;
    let left = false, right = false,
        up = false, down = false,
        jump = false, shift = false;

    let inputFlags = 0;
    if (debugRun) {
        inputFlags = RIGHT;
    }

    if (input.getAction(action.right)) {
        speedX = 1;
        inputFlags |= RIGHT;
        right = true;
    } else if (input.getAction(action.left)) {
        speedX = -1;
        inputFlags |= LEFT;
        left = true;
    }

    if (input.getAction(action.up)) {
        speedY = -1;
        inputFlags |= UP;
        up = true;
    } else if (input.getAction(action.down)) {
        speedY = 1;
        inputFlags |= DOWN;
        down = true;
    }

    if (input.getActionDown(action.jump)) {
        inputFlags |= JUMP;
        jump = true;
    }

    if (lastSentInput !== inputFlags) {
        const buffer = new ArrayBuffer(10);
        const view = new DataView(buffer);

        inputSequence++;

        view.setUint8(0, 4); // Input message
        view.setUint8(1, inputFlags);
        view.setInt32(2, inputSequence, lilEndian);
        view.setFloat32(6, clientTime, lilEndian);

        inputHistory.push({
            id: inputSequence,
            time: clientTime,
            input: inputFlags,
            right: right,
            left: left,
            up: up,
            down: down,
            jump: jump
        });

        socket.send(buffer);
    }

    player.x += speedX * elapsed * 300;
    player.y += speedY * elapsed * 300;
}

function draw() {
    context.fillStyle = "#222";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#a00";
    context.fillRect(player.x - 16, player.y - 16, 32, 32);
}

function ping() {
    const buffer = new ArrayBuffer(5);
    const view = new DataView(buffer);

    view.setUint8(0, 9); // Ping message
    view.setInt32(1, ++pingID, lilEndian);

    pingTime = window.performance.now();
    socket.send(buffer);
}

// Socket message handlers
function handleMessage(data) {
    var view = new Uint8Array(data, 0, 1);
    
    switch (view[0]) {
        case 2: onJoinAccepted(data); return;
        case 3: onNewPlayerJoined(data); return;
        case 5: onPlayerState(data); return;
        case 6: onPosition(data); return;
        case 9: onPing(data); return;
    }
}

function onJoinAccepted(data) {
    console.log("Join accepted");
    
    const view = new DataView(data);
    const accepted = view.getUint8(1) === 1;
    const rejectReason = view.getUint8(2);

    lilEndian = view.getUint8(3) === 1;
    playerID = view.getInt32(4, lilEndian);
    serverTime = view.getFloat32(8, lilEndian);

    clientTime = serverTime + delay;

    console.log("Accepted: " + accepted);
    console.log("Reject reason: " + rejectReason);
    console.log("lilEndian: " + lilEndian);
    console.log("My ID: " + playerID);
    console.log("Server time: " + serverTime);

    ping();
}

function onNewPlayerJoined(data) {

}

function onPlayerState(data) {

}

function onPosition(data) {

}

function onPing(data) {
    const receiveTime = window.performance.now();
    delay = (receiveTime - pingTime) / 2000; // Half of the time and ms to seconds

    const view = new DataView(data);
    const id = view.getInt32(1, lilEndian);
    const time = view.getFloat32(5, lilEndian) + delay;
    const timeError = time - serverTime;
    serverTime = time;

    console.log(`Ping - delay: ${delay}, serverTime: ${serverTime}, timeError: ${timeError}`);
}

// ArrayBuffer to String (Unicode UTF-16)
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// String to ArrayBuffer (Unicode UTF-16)
function str2ab(str, buf, offset) {
    var bufView = new Uint16Array(buf, offset);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
}