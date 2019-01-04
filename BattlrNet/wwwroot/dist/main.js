var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
System.register("IPoint", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Vector", [], function (exports_2, context_2) {
    "use strict";
    var Vector;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Vector = (function () {
                function Vector(x, y) {
                    this.x = x || 0;
                    this.y = y || 0;
                }
                Vector.prototype.copyFrom = function (other) {
                    this.x = other.x;
                    this.y = other.y;
                    return this;
                };
                Vector.prototype.add = function (other) {
                    this.x += other.x;
                    this.y += other.y;
                    return this;
                };
                Vector.prototype.subtract = function (other) {
                    this.x -= other.x;
                    this.y -= other.y;
                    return this;
                };
                Vector.prototype.multiply = function (value) {
                    this.x *= value;
                    this.y *= value;
                    return this;
                };
                Vector.prototype.round = function () {
                    this.x = Math.round(this.x);
                    this.y = Math.round(this.y);
                    return this;
                };
                Vector.prototype.clone = function () {
                    return new Vector(this.x, this.y);
                };
                Vector.prototype.dot = function (other) {
                    return this.x * other.x + this.y * other.y;
                };
                Vector.prototype.length = function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                };
                Vector.prototype.lengthSquared = function () {
                    return this.x * this.x + this.y * this.y;
                };
                Vector.prototype.distance = function (other) {
                    var x = this.x - other.x;
                    var y = this.y - other.y;
                    return Math.sqrt(x * x + y * y);
                };
                Vector.prototype.distanceSquared = function (other) {
                    var x = this.x - other.x;
                    var y = this.y - other.y;
                    return x * x + y * y;
                };
                Vector.add = function (a, b, out) {
                    if (!out)
                        out = new Vector();
                    out.x = a.x + b.x;
                    out.y = a.y + b.y;
                    return out;
                };
                Vector.subtract = function (a, b, out) {
                    if (!out)
                        out = new Vector();
                    out.x = a.x - b.x;
                    out.y = a.y - b.y;
                    return out;
                };
                Vector.multiply = function (a, value, out) {
                    if (!out)
                        out = new Vector();
                    out.x = a.x * value;
                    out.y = a.y * value;
                    return out;
                };
                Vector.dot = function (a, b) {
                    return a.dot(b);
                };
                Vector.lerp = function (a, b, t, out) {
                    if (!out)
                        out = new Vector();
                    out.x = a.x + t * (b.x - a.x);
                    out.y = a.y + t * (b.y - a.y);
                    return out;
                };
                Vector.clone = function (source, out) {
                    if (out) {
                        out.copyFrom(source);
                        return out;
                    }
                    return new Vector(source.x, source.y);
                };
                Vector.fromPoint = function (pt, out) {
                    if (!out)
                        out = new Vector();
                    out.x = pt.x;
                    out.y = pt.y;
                    return out;
                };
                Vector.round = function (source, out) {
                    if (!out)
                        out = new Vector();
                    out.x = Math.round(source.x);
                    out.y = Math.round(source.y);
                    return out;
                };
                Vector.zero = new Vector(0, 0);
                Vector.one = new Vector(1, 1);
                Vector.right = new Vector(1, 0);
                Vector.left = new Vector(-1, 0);
                Vector.up = new Vector(0, -1);
                Vector.down = new Vector(0, 1);
                return Vector;
            }());
            exports_2("default", Vector);
        }
    };
});
System.register("AABB", [], function (exports_3, context_3) {
    "use strict";
    var AABB;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            AABB = (function () {
                function AABB(center, halfSize) {
                    this.center = center;
                    this.halfSize = halfSize;
                }
                AABB.prototype.overlaps = function (other) {
                    if (Math.abs(this.center.x - other.center.x) > this.halfSize.x + other.halfSize.x)
                        return false;
                    if (Math.abs(this.center.y - other.center.y) > this.halfSize.y + other.halfSize.y)
                        return false;
                    return true;
                };
                AABB.prototype.getSize = function () {
                    return {
                        x: this.halfSize.x * 2,
                        y: this.halfSize.y * 2
                    };
                };
                return AABB;
            }());
            exports_3("default", AABB);
        }
    };
});
System.register("InputManager", [], function (exports_4, context_4) {
    "use strict";
    var InputState, InputManager;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            InputState = (function () {
                function InputState(keys) {
                    this.keys = keys;
                    this.pressed = false;
                    this.newState = false;
                    this.stateTime = 0;
                }
                return InputState;
            }());
            InputManager = (function () {
                function InputManager() {
                    this.keyStates = [];
                    this.inputActionStates = [];
                    var self = this;
                    document.addEventListener("keydown", function (ev) { return self.onKeyEvent(ev, ev.keyCode, true); }, false);
                    document.addEventListener("keyup", function (ev) { return self.onKeyEvent(ev, ev.keyCode, false); }, false);
                }
                InputManager.prototype.onKeyEvent = function (event, key, down) {
                    this.keyStates[key] = down;
                    return false;
                };
                InputManager.prototype.removeInputAction = function (id) {
                    if (this.inputActionStates.length >= id || typeof (this.inputActionStates[id]) === "undefined") {
                        this.inputActionStates[id] = undefined;
                    }
                };
                InputManager.prototype.addInputAction = function (id, keys) {
                    if (this.inputActionStates.length >= id || this.inputActionStates[id] === undefined || this.inputActionStates[id] === null) {
                        var thisKeys = [];
                        for (var i = 0; i < keys.length; i++) {
                            thisKeys.push(keys[i]);
                        }
                        this.inputActionStates[id] = new InputState(thisKeys);
                    }
                };
                InputManager.prototype.update = function (elapsed) {
                    var input, key, anyDown;
                    for (var i in this.inputActionStates) {
                        input = this.inputActionStates[i];
                        anyDown = false;
                        for (var k in input.keys) {
                            key = input.keys[k];
                            if (this.keyStates[key]) {
                                anyDown = true;
                            }
                        }
                        if (anyDown === input.pressed) {
                            input.stateTime += elapsed;
                            input.newState = false;
                        }
                        else {
                            input.stateTime = 0;
                            input.newState = true;
                            input.pressed = anyDown;
                        }
                    }
                };
                InputManager.prototype.getAction = function (id) {
                    return this.inputActionStates[id].pressed;
                };
                InputManager.prototype.getActionDown = function (id) {
                    var state = this.inputActionStates[id];
                    return state.pressed && state.newState;
                };
                InputManager.prototype.getActionUp = function (id) {
                    var state = this.inputActionStates[id];
                    return !state.pressed && state.newState;
                };
                InputManager.prototype.getInputState = function (id) {
                    return this.inputActionStates[id];
                };
                return InputManager;
            }());
            exports_4("default", InputManager);
        }
    };
});
System.register("Camera", ["Vector"], function (exports_5, context_5) {
    "use strict";
    var Vector_1, Viewport, Camera;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (Vector_1_1) {
                Vector_1 = Vector_1_1;
            }
        ],
        execute: function () {
            Viewport = (function () {
                function Viewport() {
                    this.left = 0;
                    this.right = 0;
                    this.top = 0;
                    this.bottom = 0;
                    this.width = 0;
                    this.height = 0;
                    this.scale = new Vector_1.default(1, 1);
                }
                return Viewport;
            }());
            Camera = (function () {
                function Camera(context) {
                    this.context = context;
                    this._isFollowing = false;
                    this.distance = 1000;
                    this.position = new Vector_1.default(0, 0);
                    this.fieldOfView = Math.PI / 4.0;
                    this.viewport = new Viewport();
                    this.updateViewport();
                }
                Object.defineProperty(Camera.prototype, "isFollowing", {
                    get: function () { return this._isFollowing; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "followTarget", {
                    get: function () { return this._followTarget; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "followSpeed", {
                    get: function () { return this._followSpeed; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "followOffset", {
                    get: function () { return this._followOffset; },
                    enumerable: true,
                    configurable: true
                });
                Camera.prototype.updateViewport = function () {
                    this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
                    this.viewport.width = this.distance * Math.tan(this.fieldOfView);
                    this.viewport.height = this.viewport.width / this.aspectRatio;
                    this.viewport.left = this.position.x - (this.viewport.width / 2.0);
                    this.viewport.top = this.position.y - (this.viewport.height / 2.0);
                    this.viewport.right = this.viewport.left + this.viewport.width;
                    this.viewport.bottom = this.viewport.top + this.viewport.height;
                    this.viewport.scale.x = this.context.canvas.width / this.viewport.width;
                    this.viewport.scale.y = this.context.canvas.height / this.viewport.height;
                };
                Camera.prototype.begin = function () {
                    this.context.save();
                    this.applyScale();
                    this.applyTranslation();
                };
                Camera.prototype.end = function () {
                    this.context.restore();
                };
                Camera.prototype.applyScale = function () {
                    this.context.scale(this.viewport.scale.x, this.viewport.scale.y);
                };
                Camera.prototype.applyTranslation = function () {
                    this.context.translate(-this.viewport.left, -this.viewport.top);
                };
                Camera.prototype.zoomTo = function (z) {
                    this.distance = z;
                    this.updateViewport();
                };
                Camera.prototype.moveTo = function (x, y) {
                    this.position.x = x;
                    this.position.y = y;
                    this.updateViewport();
                };
                Camera.prototype.screenToWorld = function (x, y, pt) {
                    return {
                        x: (x / this.viewport.scale.x) + this.viewport.left,
                        y: (y / this.viewport.scale.y) + this.viewport.top,
                    };
                };
                Camera.prototype.worldToScreen = function (x, y, pt) {
                    return {
                        x: (x - this.viewport.left) * (this.viewport.scale.x),
                        y: (y - this.viewport.top) * (this.viewport.scale.y),
                    };
                };
                Camera.prototype.follow = function (target, speed, offset) {
                    if (speed) {
                        if (speed <= 0 || speed > 1) {
                            console.error("Camera.follow() argument 'speed' must be greater than zero and less than or equal to 1.");
                            speed = 1;
                        }
                    }
                    else {
                        speed = 1;
                    }
                    this._followTarget = target;
                    this._followSpeed = speed;
                    if (offset) {
                        this._followOffset = offset.clone();
                    }
                    else {
                        this._followOffset = Vector_1.default.zero.clone();
                    }
                };
                Camera.prototype.stopFollowing = function () {
                    this._followTarget = undefined;
                };
                Camera.prototype.update = function (elapsed) {
                    if (!this._followTarget) {
                        return;
                    }
                    var targetPos = Vector_1.default.add(this._followTarget, this._followOffset);
                    Vector_1.default.lerp(this.position, targetPos, this._followSpeed, this.position);
                    this.updateViewport();
                };
                return Camera;
            }());
            exports_5("default", Camera);
        }
    };
});
System.register("Constants", [], function (exports_6, context_6) {
    "use strict";
    var Constants;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Constants = (function () {
                function Constants() {
                }
                Constants.networkPrecision = 3;
                Constants.tileSize = 32;
                Constants.halfTile = Constants.tileSize / 2;
                Constants.gravity = Constants.tileSize * 120;
                Constants.defaultWalkSpeed = Constants.tileSize * 10;
                Constants.defaultJumpSpeed = -Constants.tileSize * 32;
                Constants.maxFallSpeed = Constants.tileSize * 100;
                Constants.defaultAccel = Constants.tileSize * 100;
                Constants.defaultDecel = Constants.tileSize * 150;
                Constants.oneWayPlatformThreshold = 2;
                return Constants;
            }());
            exports_6("default", Constants);
        }
    };
});
System.register("Direction", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Map", ["Vector", "Constants"], function (exports_8, context_8) {
    "use strict";
    var Vector_2, Constants_1, Map;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (Vector_2_1) {
                Vector_2 = Vector_2_1;
            },
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            }
        ],
        execute: function () {
            Map = (function () {
                function Map(name, width, height) {
                    this.name = name;
                    this.width = width;
                    this.height = height;
                    this.position = Vector_2.default.zero.clone();
                    this.tiles = [];
                    for (var y = 0; y < height; y++) {
                        var row = [];
                        this.tiles.push(row);
                        for (var x = 0; x < width; x++) {
                            var type = 0;
                            row.push(type);
                        }
                    }
                }
                Map.prototype.loadData = function (data) {
                    for (var y = 0; y < this.height; y++) {
                        var row = this.tiles[y];
                        for (var x = 0; x < this.width; x++) {
                            row[x] = data[y][x];
                        }
                    }
                };
                Map.prototype.getTilePosAtPoint = function (pt) {
                    return {
                        x: Math.floor((pt.x - this.position.x + Constants_1.default.tileSize / 2) / Constants_1.default.tileSize),
                        y: Math.floor((pt.y - this.position.y + Constants_1.default.tileSize / 2) / Constants_1.default.tileSize)
                    };
                };
                Map.prototype.getMapTileYAtPoint = function (y) {
                    return Math.floor((y - this.position.y + Constants_1.default.tileSize / 2) / Constants_1.default.tileSize);
                };
                Map.prototype.getMapTileXAtPoint = function (x) {
                    return Math.floor((x - this.position.x + Constants_1.default.tileSize / 2) / Constants_1.default.tileSize);
                };
                Map.prototype.getMapTilePosition = function (x, y) {
                    return new Vector_2.default(x * Constants_1.default.tileSize + this.position.x, y * Constants_1.default.tileSize + this.position.y);
                };
                Map.prototype.getTile = function (x, y) {
                    if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                        return 1;
                    return this.tiles[y][x];
                };
                Map.prototype.isObstacle = function (x, y) {
                    return this.getTile(x, y) === 1;
                };
                Map.prototype.isGround = function (x, y) {
                    var tile = this.getTile(x, y);
                    return tile === 1 || tile === 2;
                };
                return Map;
            }());
            exports_8("Map", Map);
        }
    };
});
System.register("InputActionType", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Utilities", ["Vector", "Constants"], function (exports_10, context_10) {
    "use strict";
    var Vector_3, Constants_2, Utilities;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (Vector_3_1) {
                Vector_3 = Vector_3_1;
            },
            function (Constants_2_1) {
                Constants_2 = Constants_2_1;
            }
        ],
        execute: function () {
            Utilities = (function () {
                function Utilities() {
                }
                Utilities.FlagTest = function (currentValue, flag) {
                    return currentValue & flag;
                };
                Utilities.FlagSet = function (currentValue, flag) {
                    return currentValue | flag;
                };
                Utilities.FlagUnset = function (currentValue, flag) {
                    return currentValue & ~flag;
                };
                Utilities.roundNumber = function (val) {
                    return parseFloat(val.toFixed(Constants_2.default.networkPrecision));
                };
                Utilities.roundVector = function (val, out) {
                    if (!out)
                        out = new Vector_3.default();
                    out.x = Utilities.roundNumber(val.x);
                    out.y = Utilities.roundNumber(val.y);
                    return out;
                };
                Utilities.randomColor = function (min, max) {
                    var range = max - min;
                    var r = Math.round(Math.random() * range + min);
                    var g = Math.round(Math.random() * range + min);
                    var b = Math.round(Math.random() * range + min);
                    return "rgb(" + r + "," + g + "," + b + ")";
                };
                Utilities.AllInputActions = [
                    2,
                    4,
                    8,
                    16,
                    32,
                    64,
                    128,
                    256,
                    512,
                    1024,
                    2048
                ];
                return Utilities;
            }());
            exports_10("default", Utilities);
        }
    };
});
System.register("Color", [], function (exports_11, context_11) {
    "use strict";
    var Color;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
            Color = (function () {
                function Color(_r, _g, _b) {
                    if (_r === void 0) { _r = 0; }
                    if (_g === void 0) { _g = 0; }
                    if (_b === void 0) { _b = 0; }
                    this._r = _r;
                    this._g = _g;
                    this._b = _b;
                    this._css = "rgb(0,0,0)";
                    this.updateCss();
                }
                Object.defineProperty(Color.prototype, "r", {
                    get: function () { return this._r; },
                    set: function (value) { this._r = value; this.updateCss(); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Color.prototype, "g", {
                    get: function () { return this._g; },
                    set: function (value) { this._g = value; this.updateCss(); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Color.prototype, "b", {
                    get: function () { return this._b; },
                    set: function (value) { this._b = value; this.updateCss(); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Color.prototype, "css", {
                    get: function () { return this._css; },
                    enumerable: true,
                    configurable: true
                });
                Color.prototype.set = function (r, g, b) {
                    if (r === void 0) { r = 0; }
                    if (g === void 0) { g = 0; }
                    if (b === void 0) { b = 0; }
                    this._r = r;
                    this._g = g;
                    this._b = b;
                    this.updateCss();
                };
                Color.prototype.updateCss = function () {
                    this._css = "rgb(" + this._r + "," + this._g + "," + this._b + ")";
                };
                return Color;
            }());
            exports_11("default", Color);
        }
    };
});
System.register("MovingObject", ["Vector", "AABB", "Constants", "Utilities", "Color"], function (exports_12, context_12) {
    "use strict";
    var Vector_4, AABB_1, Constants_3, Utilities_1, Color_1, MovingObject;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (Vector_4_1) {
                Vector_4 = Vector_4_1;
            },
            function (AABB_1_1) {
                AABB_1 = AABB_1_1;
            },
            function (Constants_3_1) {
                Constants_3 = Constants_3_1;
            },
            function (Utilities_1_1) {
                Utilities_1 = Utilities_1_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            }
        ],
        execute: function () {
            MovingObject = (function () {
                function MovingObject(engine, position, aabbHalfSize) {
                    this.engine = engine;
                    this.position = position;
                    this.name = "";
                    this.color = new Color_1.default();
                    this.drawPosition = Vector_4.default.zero.clone();
                    this.ready = false;
                    this.velocity = Vector_4.default.zero.clone();
                    this.maxVelocity = new Vector_4.default(Constants_3.default.defaultWalkSpeed, Constants_3.default.maxFallSpeed);
                    this.jumpSpeed = Constants_3.default.defaultJumpSpeed;
                    this.accel = Constants_3.default.defaultAccel;
                    this.decel = Constants_3.default.defaultDecel;
                    this.scale = Vector_4.default.one.clone();
                    this.aabbOffset = Vector_4.default.zero.clone();
                    this.moveRight = false;
                    this.moveLeft = false;
                    this.moveDown = false;
                    this.jumping = false;
                    this.running = false;
                    this.pushedRightWall = false;
                    this.pushesRightWall = false;
                    this.pushedLeftWall = false;
                    this.pushesLeftWall = false;
                    this.wasOnGround = false;
                    this.onGround = false;
                    this.wasAtCeiling = false;
                    this.atCeiling = false;
                    this.onOneWayPlatform = false;
                    this.oldSpeed = Vector_4.default.zero.clone();
                    this.groundCheckResults = {
                        onGround: false,
                        onOneWayPlatform: false,
                        groundY: 0
                    };
                    this.oldPosition = Vector_4.default.clone(position);
                    this.aabb = new AABB_1.default(Vector_4.default.zero.clone(), Vector_4.default.clone(aabbHalfSize));
                    Vector_4.default.add(this.position, this.aabbOffset, this.aabb.center);
                    this.drawPosition.copyFrom(position);
                }
                MovingObject.prototype.update = function (elapsed) {
                    this.oldPosition.copyFrom(this.position);
                    this.oldSpeed.copyFrom(this.velocity);
                    this.wasOnGround = this.onGround;
                    this.pushedRightWall = this.pushesRightWall;
                    this.pushedLeftWall = this.pushesLeftWall;
                    this.wasAtCeiling = this.atCeiling;
                    var max = this.running ? this.maxVelocity.x * 1.5 : this.maxVelocity.x;
                    var accel;
                    if (this.moveRight && this.velocity.x < max) {
                        if (this.velocity.x < 0) {
                            accel = this.decel;
                        }
                        else {
                            accel = this.accel;
                        }
                        this.velocity.x += accel * elapsed;
                        if (this.velocity.x > max) {
                            this.velocity.x = max;
                        }
                    }
                    else if (this.moveLeft && this.velocity.x > -max) {
                        if (this.velocity.x > 0) {
                            accel = this.decel;
                        }
                        else {
                            accel = this.accel;
                        }
                        this.velocity.x -= accel * elapsed;
                        if (this.velocity.x < -max) {
                            this.velocity.x = -max;
                        }
                    }
                    else if (this.velocity.x > 0) {
                        this.velocity.x -= this.decel * elapsed;
                        if (this.velocity.x < 0) {
                            this.velocity.x = 0;
                        }
                    }
                    else if (this.velocity.x < 0) {
                        this.velocity.x += this.decel * elapsed;
                        if (this.velocity.x > 0) {
                            this.velocity.x = 0;
                        }
                    }
                    if (this.jumping && this.onGround) {
                        this.velocity.y = this.jumpSpeed;
                    }
                    else {
                        this.velocity.y += Constants_3.default.gravity * elapsed;
                    }
                    this.jumping = false;
                    this.position.add(Vector_4.default.multiply(this.velocity, elapsed));
                    var oldCenter = Vector_4.default.add(this.oldPosition, this.aabbOffset);
                    var center = Vector_4.default.add(this.position, this.aabbOffset);
                    var rightWallX = undefined, leftWallX = undefined;
                    if (this.velocity.x <= 0) {
                        leftWallX = this.checkLeft(oldCenter, center);
                        if (leftWallX != undefined) {
                            if (this.oldPosition.x - this.aabb.halfSize.x + this.aabbOffset.x >= leftWallX) {
                                this.position.x = leftWallX + this.aabb.halfSize.x - this.aabbOffset.x;
                                this.pushesLeftWall = true;
                            }
                            this.velocity.x = Math.max(this.velocity.x, 0);
                        }
                        else {
                            this.pushesLeftWall = false;
                        }
                    }
                    else {
                        this.pushesLeftWall = false;
                    }
                    if (this.velocity.x >= 0) {
                        rightWallX = this.checkRight(oldCenter, center);
                        if (rightWallX != undefined) {
                            if (this.oldPosition.x + this.aabb.halfSize.x + this.aabbOffset.x <= rightWallX) {
                                this.position.x = rightWallX - this.aabb.halfSize.x - this.aabbOffset.x;
                                this.pushesRightWall = true;
                            }
                            this.velocity.x = Math.min(this.velocity.x, 0);
                        }
                        else {
                            this.pushesRightWall = false;
                        }
                    }
                    else {
                        this.pushesRightWall = false;
                    }
                    if (this.velocity.y >= 0 && this.checkGround(oldCenter, center, this.groundCheckResults)) {
                        this.position.y = this.groundCheckResults.groundY - this.aabb.halfSize.y - this.aabbOffset.y;
                        this.onOneWayPlatform = this.groundCheckResults.onOneWayPlatform;
                        this.velocity.y = 0;
                        this.onGround = true;
                    }
                    else {
                        this.onGround = false;
                        this.onOneWayPlatform = false;
                    }
                    this.atCeiling = false;
                    if (this.velocity.y <= 0) {
                        var ceilingY = this.checkCeiling(oldCenter, center);
                        if (ceilingY !== undefined) {
                            this.atCeiling = true;
                            this.position.y = ceilingY + this.aabb.halfSize.y - this.aabbOffset.y + 1;
                            this.velocity.y = 0;
                        }
                    }
                    if (this.moveDown && this.onOneWayPlatform) {
                        this.position.y += Constants_3.default.oneWayPlatformThreshold + 1;
                    }
                    else {
                        this.moveDown = false;
                    }
                    Utilities_1.default.roundVector(this.velocity, this.velocity);
                    Utilities_1.default.roundVector(this.position, this.position);
                    Vector_4.default.add(this.position, this.aabbOffset, this.aabb.center);
                };
                MovingObject.prototype.checkGround = function (oldCenter, center, groundCheckResults) {
                    groundCheckResults.onOneWayPlatform = false;
                    groundCheckResults.onGround = false;
                    groundCheckResults.groundY = 0;
                    var oldBottomLeft = new Vector_4.default(oldCenter.x - this.aabb.halfSize.x + Vector_4.default.right.x, oldCenter.y + this.aabb.halfSize.y + Vector_4.default.down.y).round();
                    var newBottomLeft = new Vector_4.default(center.x - this.aabb.halfSize.x + Vector_4.default.right.x, center.y + this.aabb.halfSize.y + Vector_4.default.down.y).round();
                    var endY = this.engine.map.getMapTileYAtPoint(newBottomLeft.y);
                    var begY = Math.min(this.engine.map.getMapTileYAtPoint(oldBottomLeft.y) + 1, endY);
                    var dist = Math.max(Math.abs(endY - begY), 1);
                    var checkedTile = new Vector_4.default(), bottomLeft = new Vector_4.default(), bottomRight = new Vector_4.default();
                    var tileIndexX, tile;
                    for (var tileIndexY = begY; tileIndexY <= endY; tileIndexY++) {
                        Vector_4.default.lerp(oldBottomLeft, newBottomLeft, Math.abs(endY - tileIndexY) / dist, bottomLeft);
                        bottomRight.x = bottomLeft.x + this.aabb.halfSize.x * 2 - 2;
                        bottomRight.y = bottomLeft.y;
                        checkedTile.copyFrom(bottomLeft);
                        while (true) {
                            checkedTile.x = Math.min(checkedTile.x, bottomRight.x);
                            tileIndexX = this.engine.map.getMapTileXAtPoint(checkedTile.x);
                            tile = this.engine.map.getTile(tileIndexX, tileIndexY);
                            groundCheckResults.groundY = tileIndexY * Constants_3.default.tileSize - Constants_3.default.tileSize / 2 + this.engine.map.position.y;
                            if (tile === 1) {
                                groundCheckResults.onGround = true;
                                groundCheckResults.onOneWayPlatform = false;
                                return true;
                            }
                            else if (tile === 2
                                && Math.abs(checkedTile.y - groundCheckResults.groundY) <= Constants_3.default.oneWayPlatformThreshold + (this.position.y - this.oldPosition.y)) {
                                groundCheckResults.onOneWayPlatform = true;
                            }
                            if (checkedTile.x >= bottomRight.x) {
                                if (groundCheckResults.onOneWayPlatform) {
                                    return true;
                                }
                                break;
                            }
                            checkedTile.x += Constants_3.default.tileSize;
                        }
                    }
                    return false;
                };
                MovingObject.prototype.checkCeiling = function (oldCenter, center) {
                    var oldTopRight = new Vector_4.default(oldCenter.x + this.aabb.halfSize.x - Vector_4.default.right.x, oldCenter.y - this.aabb.halfSize.y + Vector_4.default.up.y).round();
                    var newTopRight = new Vector_4.default(center.x + this.aabb.halfSize.x - Vector_4.default.right.x, center.y - this.aabb.halfSize.y + Vector_4.default.up.y).round();
                    var endY = this.engine.map.getMapTileYAtPoint(newTopRight.y);
                    var begY = Math.max(this.engine.map.getMapTileYAtPoint(oldTopRight.y) - 1, endY);
                    var dist = Math.max(Math.abs(endY - begY), 1);
                    var checkedTile = new Vector_4.default(), topLeft = new Vector_4.default(), topRight = new Vector_4.default();
                    var tileIndexX, tile;
                    for (var tileIndexY = begY; tileIndexY >= endY; tileIndexY--) {
                        Vector_4.default.lerp(oldTopRight, newTopRight, Math.abs(endY - tileIndexY) / dist, topRight);
                        topLeft.x = topRight.x - this.aabb.halfSize.x * 2 + 2;
                        topLeft.y = topRight.y;
                        checkedTile.copyFrom(topLeft);
                        while (true) {
                            checkedTile.x = Math.min(checkedTile.x, topRight.x);
                            tileIndexX = this.engine.map.getMapTileXAtPoint(checkedTile.x);
                            tile = this.engine.map.getTile(tileIndexX, tileIndexY);
                            if (tile === 1) {
                                return tileIndexY * Constants_3.default.tileSize + Constants_3.default.tileSize / 2 + this.engine.map.position.y;
                            }
                            if (checkedTile.x >= topRight.x) {
                                break;
                            }
                            checkedTile.x += Constants_3.default.tileSize;
                        }
                    }
                    return undefined;
                };
                MovingObject.prototype.checkLeft = function (oldCenter, center) {
                    var oldBottomLeft = new Vector_4.default(oldCenter.x - this.aabb.halfSize.x - 1, oldCenter.y + this.aabb.halfSize.y - 1).round();
                    var newBottomLeft = new Vector_4.default(center.x - this.aabb.halfSize.x - 1, center.y + this.aabb.halfSize.y - 1).round();
                    var endX = this.engine.map.getMapTileXAtPoint(newBottomLeft.x);
                    var begX = Math.max(this.engine.map.getMapTileXAtPoint(oldBottomLeft.x) - 1, endX);
                    var dist = Math.max(Math.abs(endX - begX), 1);
                    var checkedTile = new Vector_4.default(), bottomLeft = new Vector_4.default(), topLeft = new Vector_4.default();
                    var tileIndexY, tile;
                    for (var tileIndexX = begX; tileIndexX >= endX; tileIndexX--) {
                        Vector_4.default.lerp(oldBottomLeft, newBottomLeft, Math.abs(endX - tileIndexX) / dist, bottomLeft);
                        topLeft.x = bottomLeft.x;
                        topLeft.y = bottomLeft.y - this.aabb.halfSize.y * 2 + 2;
                        checkedTile.copyFrom(bottomLeft);
                        while (true) {
                            checkedTile.y = Math.max(checkedTile.y, topLeft.y);
                            tileIndexY = this.engine.map.getMapTileYAtPoint(checkedTile.y);
                            tile = this.engine.map.getTile(tileIndexX, tileIndexY);
                            if (tile === 1) {
                                return tileIndexX * Constants_3.default.tileSize + Constants_3.default.tileSize / 2 + this.engine.map.position.x;
                            }
                            checkedTile.y -= Constants_3.default.tileSize;
                            if (checkedTile.y <= topLeft.y) {
                                break;
                            }
                        }
                    }
                    return undefined;
                };
                MovingObject.prototype.checkRight = function (oldCenter, center) {
                    var oldBottomRight = new Vector_4.default(oldCenter.x + this.aabb.halfSize.x + 1, oldCenter.y + this.aabb.halfSize.y - 1).round();
                    var newBottomRight = new Vector_4.default(center.x + this.aabb.halfSize.x + 1, center.y + this.aabb.halfSize.y - 1).round();
                    var endX = this.engine.map.getMapTileXAtPoint(newBottomRight.x);
                    var begX = Math.min(this.engine.map.getMapTileXAtPoint(oldBottomRight.x) + 1, endX);
                    var dist = Math.max(Math.abs(endX - begX), 1);
                    var checkedTile = new Vector_4.default(), bottomRight = new Vector_4.default(), topRight = new Vector_4.default();
                    var tileIndexY, tile;
                    for (var tileIndexX = begX; tileIndexX <= endX; tileIndexX++) {
                        Vector_4.default.lerp(oldBottomRight, newBottomRight, Math.abs(endX - tileIndexX) / dist, bottomRight);
                        topRight.x = bottomRight.x;
                        topRight.y = bottomRight.y - this.aabb.halfSize.y * 2 + 2;
                        checkedTile.copyFrom(bottomRight);
                        while (true) {
                            checkedTile.y = Math.max(checkedTile.y, topRight.y);
                            tileIndexY = this.engine.map.getMapTileYAtPoint(checkedTile.y);
                            tile = this.engine.map.getTile(tileIndexX, tileIndexY);
                            if (tile === 1) {
                                return tileIndexX * Constants_3.default.tileSize - Constants_3.default.tileSize / 2 + this.engine.map.position.x;
                            }
                            checkedTile.y -= Constants_3.default.tileSize;
                            if (checkedTile.y <= topRight.y) {
                                break;
                            }
                        }
                    }
                    return undefined;
                };
                return MovingObject;
            }());
            exports_12("default", MovingObject);
        }
    };
});
System.register("EntityState", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Entity", ["Vector", "MovingObject"], function (exports_14, context_14) {
    "use strict";
    var Vector_5, MovingObject_1, Entity;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (Vector_5_1) {
                Vector_5 = Vector_5_1;
            },
            function (MovingObject_1_1) {
                MovingObject_1 = MovingObject_1_1;
            }
        ],
        execute: function () {
            Entity = (function (_super) {
                __extends(Entity, _super);
                function Entity(engine, position, aabbHalfSize) {
                    var _this = _super.call(this, engine, position, aabbHalfSize) || this;
                    _this.MinSpeed = 0.001;
                    _this.entityState = 0;
                    _this.targetScale = Vector_5.default.one.clone();
                    _this.scaleVelocity = 1;
                    return _this;
                }
                Entity.prototype.update = function (elapsed) {
                    _super.prototype.update.call(this, elapsed);
                    if (this.targetScale.x > this.scale.x) {
                        this.scale.x += this.scaleVelocity * elapsed;
                        if (this.scale.x > this.targetScale.x) {
                            this.scale.x = this.targetScale.x;
                        }
                    }
                    if (this.velocity.lengthSquared() < this.MinSpeed) {
                        this.entityState = 0;
                        if (!this.wasOnGround) {
                        }
                    }
                    else if (this.velocity.y < -this.MinSpeed) {
                        this.entityState = 2;
                        if (this.wasOnGround) {
                        }
                    }
                    else if (this.velocity.y > this.MinSpeed) {
                        this.entityState = 3;
                    }
                    else if (this.velocity.x < -this.MinSpeed) {
                        this.entityState = 1;
                    }
                    else if (this.velocity.x > this.MinSpeed) {
                        this.entityState = 1;
                    }
                };
                return Entity;
            }(MovingObject_1.default));
            exports_14("default", Entity);
        }
    };
});
System.register("Network/Messages/MessageType", [], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Network/Messages/IMessage", [], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Network/Messages/PingMessage", [], function (exports_17, context_17) {
    "use strict";
    var PingMessage;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            PingMessage = (function () {
                function PingMessage() {
                    this.messageType = 8;
                    this.minimumDataLength = 9;
                }
                PingMessage.prototype.fromBytes = function (data, littleEndian) {
                    this.pingID = data.getInt32(1, littleEndian);
                    this.avgFrameTime = data.getFloat32(5, littleEndian);
                };
                PingMessage.prototype.toBytes = function (littleEndian) {
                    var buffer = new ArrayBuffer(this.minimumDataLength);
                    var view = new DataView(buffer);
                    view.setUint8(0, this.messageType);
                    view.setInt32(1, this.pingID, littleEndian);
                    return buffer;
                };
                return PingMessage;
            }());
            exports_17("default", PingMessage);
        }
    };
});
System.register("Network/Messages/RejectReason", [], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Network/NetworkHelper", [], function (exports_19, context_19) {
    "use strict";
    var NetworkHelper;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
            NetworkHelper = (function () {
                function NetworkHelper() {
                }
                NetworkHelper.ArrayBufferToString = function (buffer) {
                    return String.fromCharCode.apply(undefined, new Uint16Array(buffer));
                };
                NetworkHelper.StringToArrayBuffer = function (str, buffer, offset) {
                    var view = new Uint16Array(buffer, offset);
                    var strLen = str.length;
                    for (var i = 0; i < strLen; i++) {
                        view[i] = str.charCodeAt(i);
                    }
                };
                return NetworkHelper;
            }());
            exports_19("default", NetworkHelper);
        }
    };
});
System.register("Network/Messages/JoinAcceptedMessage", ["Network/NetworkHelper", "Color"], function (exports_20, context_20) {
    "use strict";
    var NetworkHelper_1, Color_2, JoinAcceptedMessage;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (NetworkHelper_1_1) {
                NetworkHelper_1 = NetworkHelper_1_1;
            },
            function (Color_2_1) {
                Color_2 = Color_2_1;
            }
        ],
        execute: function () {
            JoinAcceptedMessage = (function () {
                function JoinAcceptedMessage() {
                    this.messageType = 2;
                    this.minimumDataLength = 20;
                }
                JoinAcceptedMessage.prototype.fromBytes = function (data, littleEndian) {
                    this.accepted = data.getUint8(1) === 1;
                    this.rejectReason = data.getUint8(2);
                    this.isLittleEndian = data.getUint8(3) === 1;
                    this.id = data.getUint8(4);
                    this.mapID = data.getInt32(5, this.isLittleEndian);
                    this.color = new Color_2.default(data.getUint8(9), data.getUint8(10), data.getUint8(11));
                    var length = data.getUint8(12);
                    var nameBuffer = new ArrayBuffer(length);
                    var nameView = new DataView(nameBuffer);
                    for (var i = 0; i < nameBuffer.byteLength; i++) {
                        nameView.setUint8(i, data.getUint8(13 + i));
                    }
                    this.name = NetworkHelper_1.default.ArrayBufferToString(nameBuffer);
                };
                JoinAcceptedMessage.prototype.toBytes = function (littleEndian) { return new ArrayBuffer(0); };
                return JoinAcceptedMessage;
            }());
            exports_20("default", JoinAcceptedMessage);
        }
    };
});
System.register("Network/Messages/JoinRequestMessage", ["Network/NetworkHelper"], function (exports_21, context_21) {
    "use strict";
    var NetworkHelper_2, JoinRequestMessage;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (NetworkHelper_2_1) {
                NetworkHelper_2 = NetworkHelper_2_1;
            }
        ],
        execute: function () {
            JoinRequestMessage = (function () {
                function JoinRequestMessage() {
                    this.messageType = 1;
                    this.minimumDataLength = 3;
                }
                Object.defineProperty(JoinRequestMessage.prototype, "maxNameLength", {
                    get: function () { return 25; },
                    enumerable: true,
                    configurable: true
                });
                JoinRequestMessage.prototype.fromBytes = function (data, littleEndian) { };
                JoinRequestMessage.prototype.toBytes = function (littleEndian) {
                    if (this.name.length > this.maxNameLength) {
                        this.name = this.name.substr(0, this.maxNameLength);
                    }
                    var buffer = new ArrayBuffer(this.name.length * 2 + 2);
                    var view = new DataView(buffer);
                    view.setUint8(0, this.messageType);
                    view.setUint8(1, this.name.length * 2);
                    NetworkHelper_2.default.StringToArrayBuffer(this.name, buffer, 2);
                    return buffer;
                };
                return JoinRequestMessage;
            }());
            exports_21("default", JoinRequestMessage);
        }
    };
});
System.register("Network/Messages/PlayerInputMessage", ["Utilities"], function (exports_22, context_22) {
    "use strict";
    var Utilities_2, PlayerInputMessage;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (Utilities_2_1) {
                Utilities_2 = Utilities_2_1;
            }
        ],
        execute: function () {
            PlayerInputMessage = (function () {
                function PlayerInputMessage() {
                    this.messageType = 4;
                    this.minimumDataLength = 7;
                    this.lastJump = false;
                    this.lastDown = false;
                    this.moveRight = false;
                    this.moveLeft = false;
                    this.moveDown = false;
                    this.jumping = false;
                    this.running = false;
                    this.pushedRightWall = false;
                    this.pushesRightWall = false;
                    this.pushedLeftWall = false;
                    this.pushesLeftWall = false;
                    this.wasOnGround = false;
                    this.onGround = false;
                    this.wasAtCeiling = false;
                    this.atCeiling = false;
                    this.onOneWayPlatform = false;
                }
                Object.defineProperty(PlayerInputMessage.prototype, "right", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 2); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "left", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 4); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "up", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 8); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "down", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 16); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "jump", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 32); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "run", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 64); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "action1", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 128); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "action2", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 256); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlayerInputMessage.prototype, "action3", {
                    get: function () { return Utilities_2.default.FlagTest(this.input, 512); },
                    enumerable: true,
                    configurable: true
                });
                PlayerInputMessage.prototype.fromBytes = function (data, littleEndian) { };
                PlayerInputMessage.prototype.toBytes = function (littleEndian) {
                    var buffer = new ArrayBuffer(this.minimumDataLength);
                    var view = new DataView(buffer);
                    view.setUint8(0, this.messageType);
                    view.setUint16(1, this.input, littleEndian);
                    view.setInt32(3, this.sequence, littleEndian);
                    return buffer;
                };
                return PlayerInputMessage;
            }());
            exports_22("default", PlayerInputMessage);
        }
    };
});
System.register("Network/Messages/PositionMessage", [], function (exports_23, context_23) {
    "use strict";
    var PositionMessage;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
            PositionMessage = (function () {
                function PositionMessage() {
                    this.messageType = 6;
                    this.minimumDataLength = 29;
                }
                PositionMessage.prototype.fromBytes = function (data, littleEndian) {
                    this.id = data.getInt32(1, littleEndian);
                    this.positionX = data.getFloat32(5, littleEndian);
                    this.positionY = data.getFloat32(9, littleEndian);
                    this.velocityX = data.getFloat32(13, littleEndian);
                    this.velocityY = data.getFloat32(17, littleEndian);
                    this.tick = data.getInt32(21, littleEndian);
                    this.sequence = data.getInt32(25, littleEndian);
                };
                PositionMessage.prototype.toBytes = function (littleEndian) { return null; };
                return PositionMessage;
            }());
            exports_23("default", PositionMessage);
        }
    };
});
System.register("LocalPlayer", ["Entity", "Utilities", "Vector"], function (exports_24, context_24) {
    "use strict";
    var Entity_1, Utilities_3, Vector_6, LocalPlayer;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (Entity_1_1) {
                Entity_1 = Entity_1_1;
            },
            function (Utilities_3_1) {
                Utilities_3 = Utilities_3_1;
            },
            function (Vector_6_1) {
                Vector_6 = Vector_6_1;
            }
        ],
        execute: function () {
            LocalPlayer = (function (_super) {
                __extends(LocalPlayer, _super);
                function LocalPlayer() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.lastJump = false;
                    _this.lastDown = false;
                    _this.serverPosition = Vector_6.default.zero.clone();
                    return _this;
                }
                LocalPlayer.prototype.playerUpdate = function (input, elapsed) {
                    if (Utilities_3.default.FlagTest(input, 2)) {
                        this.moveRight = true;
                        this.moveLeft = false;
                    }
                    else if (Utilities_3.default.FlagTest(input, 4)) {
                        this.moveRight = false;
                        this.moveLeft = true;
                    }
                    else {
                        this.moveRight = false;
                        this.moveLeft = false;
                    }
                    if (Utilities_3.default.FlagTest(input, 64)) {
                        this.running = true;
                    }
                    else {
                        this.running = false;
                    }
                    if (Utilities_3.default.FlagTest(input, 32)) {
                        if (!this.lastJump) {
                            this.jumping = true;
                            this.lastJump = true;
                        }
                    }
                    else {
                        this.jumping = false;
                        this.lastJump = false;
                    }
                    if (Utilities_3.default.FlagTest(input, 16)) {
                        if (!this.lastDown) {
                            this.moveDown = true;
                            this.lastDown = true;
                        }
                    }
                    else {
                        this.moveDown = false;
                        this.lastDown = false;
                    }
                    _super.prototype.update.call(this, elapsed);
                };
                return LocalPlayer;
            }(Entity_1.default));
            exports_24("default", LocalPlayer);
        }
    };
});
System.register("Network/Messages/StateUpdateMessage", ["Network/Messages/PositionMessage"], function (exports_25, context_25) {
    "use strict";
    var PositionMessage_1, StateUpdateMessage;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (PositionMessage_1_1) {
                PositionMessage_1 = PositionMessage_1_1;
            }
        ],
        execute: function () {
            StateUpdateMessage = (function () {
                function StateUpdateMessage() {
                    this.messageType = 9;
                    this.minimumDataLength = 1;
                }
                StateUpdateMessage.prototype.fromBytes = function (data, littleEndian) {
                    this.players = [];
                    var numPlayers = data.getUint8(1);
                    var index = 2;
                    for (var i = 0; i < numPlayers; i++) {
                        var pos = new PositionMessage_1.default();
                        this.players.push(pos);
                        pos.id = data.getUint8(index);
                        pos.positionX = data.getFloat32(index + 1, littleEndian);
                        pos.positionY = data.getFloat32(index + 5, littleEndian);
                        pos.velocityX = data.getFloat32(index + 9, littleEndian);
                        pos.velocityY = data.getFloat32(index + 13, littleEndian);
                        pos.sequence = data.getInt32(index + 17, littleEndian);
                        index += 21;
                    }
                };
                StateUpdateMessage.prototype.toBytes = function (littleEndian) { return null; };
                return StateUpdateMessage;
            }());
            exports_25("default", StateUpdateMessage);
        }
    };
});
System.register("Network/Messages/PlayerInfoMessage", ["Color", "Network/NetworkHelper"], function (exports_26, context_26) {
    "use strict";
    var Color_3, NetworkHelper_3, PlayerInfoMessage;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (Color_3_1) {
                Color_3 = Color_3_1;
            },
            function (NetworkHelper_3_1) {
                NetworkHelper_3 = NetworkHelper_3_1;
            }
        ],
        execute: function () {
            PlayerInfoMessage = (function () {
                function PlayerInfoMessage() {
                    this.messageType = 11;
                    this.minimumDataLength = 6;
                }
                PlayerInfoMessage.prototype.fromBytes = function (data, littleEndian) {
                    this.id = data.getUint8(1);
                    this.color = new Color_3.default(data.getUint8(2), data.getUint8(3), data.getUint8(4));
                    var length = data.getUint8(5);
                    var nameBuffer = new ArrayBuffer(length);
                    var nameView = new DataView(nameBuffer);
                    for (var i = 0; i < nameBuffer.byteLength; i++) {
                        nameView.setUint8(i, data.getUint8(6 + i));
                    }
                    this.name = NetworkHelper_3.default.ArrayBufferToString(nameBuffer);
                };
                PlayerInfoMessage.prototype.toBytes = function (littleEndian) { return new ArrayBuffer(0); };
                return PlayerInfoMessage;
            }());
            exports_26("default", PlayerInfoMessage);
        }
    };
});
System.register("Network/Messages/PlayerInfoRequestMessage", [], function (exports_27, context_27) {
    "use strict";
    var PlayerInfoRequestMessage;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [],
        execute: function () {
            PlayerInfoRequestMessage = (function () {
                function PlayerInfoRequestMessage() {
                    this.messageType = 10;
                    this.minimumDataLength = 2;
                }
                PlayerInfoRequestMessage.prototype.fromBytes = function (data, littleEndian) { };
                PlayerInfoRequestMessage.prototype.toBytes = function (littleEndian) {
                    var buffer = new ArrayBuffer(this.minimumDataLength);
                    var view = new DataView(buffer);
                    view.setUint8(0, this.messageType);
                    view.setUint8(1, this.id);
                    return buffer;
                };
                return PlayerInfoRequestMessage;
            }());
            exports_27("default", PlayerInfoRequestMessage);
        }
    };
});
System.register("Network/NetworkClient", ["Network/Messages/PingMessage", "Network/Messages/JoinAcceptedMessage", "Network/Messages/JoinRequestMessage", "Network/Messages/PlayerInputMessage", "Network/Messages/StateUpdateMessage", "Network/Messages/PlayerInfoMessage", "Network/Messages/PlayerInfoRequestMessage"], function (exports_28, context_28) {
    "use strict";
    var PingMessage_1, JoinAcceptedMessage_1, JoinRequestMessage_1, PlayerInputMessage_1, StateUpdateMessage_1, PlayerInfoMessage_1, PlayerInfoRequestMessage_1, NetworkClient;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (PingMessage_1_1) {
                PingMessage_1 = PingMessage_1_1;
            },
            function (JoinAcceptedMessage_1_1) {
                JoinAcceptedMessage_1 = JoinAcceptedMessage_1_1;
            },
            function (JoinRequestMessage_1_1) {
                JoinRequestMessage_1 = JoinRequestMessage_1_1;
            },
            function (PlayerInputMessage_1_1) {
                PlayerInputMessage_1 = PlayerInputMessage_1_1;
            },
            function (StateUpdateMessage_1_1) {
                StateUpdateMessage_1 = StateUpdateMessage_1_1;
            },
            function (PlayerInfoMessage_1_1) {
                PlayerInfoMessage_1 = PlayerInfoMessage_1_1;
            },
            function (PlayerInfoRequestMessage_1_1) {
                PlayerInfoRequestMessage_1 = PlayerInfoRequestMessage_1_1;
            }
        ],
        execute: function () {
            NetworkClient = (function () {
                function NetworkClient(connectionUrl, pingInterval) {
                    this.connectionUrl = connectionUrl;
                    this.pingInterval = pingInterval;
                    this.pingTime = 0;
                    this.pingID = 0;
                    this.pingTimeout = 0;
                    this._socketReady = false;
                    this._joinedGame = false;
                    this._clientTime = 0;
                    this._serverTime = 0;
                    this._delay = 0.1;
                    this._serverIsLittleEndian = false;
                    this._playerID = 0;
                    this.pingElement = document.getElementById("debug-ping");
                }
                Object.defineProperty(NetworkClient.prototype, "socketReady", {
                    get: function () { return this._socketReady; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkClient.prototype, "joinedGame", {
                    get: function () { return this._joinedGame; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkClient.prototype, "clientTime", {
                    get: function () { return this._clientTime; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkClient.prototype, "serverTime", {
                    get: function () { return this._serverTime; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkClient.prototype, "delay", {
                    get: function () { return this._delay; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkClient.prototype, "serverIsLittleEndian", {
                    get: function () { return this._serverIsLittleEndian; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NetworkClient.prototype, "playerID", {
                    get: function () { return this._playerID; },
                    enumerable: true,
                    configurable: true
                });
                NetworkClient.prototype.sendMessage = function (msg) {
                    var _this = this;
                    if (!this._socketReady) {
                        return;
                    }
                    var buffer = msg.toBytes(this._serverIsLittleEndian);
                    if (this.fakeDelay) {
                        setTimeout(function () { return _this.socket.send(buffer); }, this.fakeDelay);
                    }
                    else {
                        this.socket.send(buffer);
                    }
                };
                NetworkClient.prototype.onSocketOpened = function (ev) {
                    console.debug("Socket opened");
                    this._socketReady = true;
                    var msg = new JoinRequestMessage_1.default();
                    msg.name = "Duder " + Math.round(Math.random() * 9999);
                    this.sendMessage(msg);
                    if (this.onOpen) {
                        this.onOpen(ev);
                    }
                };
                NetworkClient.prototype.onSocketClosed = function (ev) {
                    console.debug("Socket closed");
                    this._socketReady = false;
                    this._joinedGame = false;
                    clearTimeout(this.pingTimeout);
                    this.socket = undefined;
                    if (this.onClose) {
                        this.onClose(ev);
                    }
                };
                NetworkClient.prototype.onSocketError = function (ev) {
                    console.error("Socket error");
                    console.dir(ev);
                    if (this.onError) {
                        this.onError(ev);
                    }
                };
                NetworkClient.prototype.onSocketMessage = function (ev) {
                    this.processMessage(ev.data);
                    if (this.onData) {
                        this.onData(ev);
                    }
                };
                NetworkClient.prototype.ping = function () {
                    if (!this._socketReady) {
                        return;
                    }
                    var msg = new PingMessage_1.default();
                    msg.pingID = ++this.pingID;
                    this.pingTime = window.performance.now();
                    this.sendMessage(msg);
                };
                NetworkClient.prototype.processMessage = function (data) {
                    if (!data || data.byteLength === 0) {
                        console.warn("Received empty data from server.");
                        return;
                    }
                    var view = new DataView(data);
                    var msgTypeVal = view.getUint8(0);
                    var msgType = msgTypeVal;
                    var msg = undefined;
                    switch (msgType) {
                        case 9:
                            msg = this.processStateUpdate(view);
                            break;
                        case 8:
                            msg = this.processPing(view);
                            break;
                        case 11:
                            msg = this.processPlayerInfo(view);
                            break;
                        case 2:
                            msg = this.processJoinAccepted(view);
                            break;
                        default:
                            console.warn("Received unsupported message type: " + msgTypeVal);
                            break;
                    }
                    if (msg != undefined && this.onMessage) {
                        this.onMessage(msg);
                    }
                };
                NetworkClient.prototype.processJoinAccepted = function (data) {
                    var msg = new JoinAcceptedMessage_1.default();
                    if (data.byteLength < msg.minimumDataLength) {
                        console.error("Received invalid JoinAccept message.");
                        this.disconnect();
                        return undefined;
                    }
                    msg.fromBytes(data, this._serverIsLittleEndian);
                    this._serverIsLittleEndian = msg.isLittleEndian;
                    if (msg.accepted) {
                        this._playerID = msg.id;
                        this._joinedGame = true;
                        if (this.onJoined) {
                            this.onJoined(this._playerID, msg.name, msg.color);
                        }
                        this.ping();
                    }
                    else {
                        var rejectReason = void 0;
                        switch (msg.rejectReason) {
                            case 3:
                                rejectReason = "You have been banned";
                                break;
                            case 2:
                                rejectReason = "The chosen name is already in use";
                                break;
                            case 1:
                                rejectReason = "The server already has the maximum allowed players";
                                break;
                            default:
                                rejectReason = "Unknown";
                                break;
                        }
                        console.error("Unable to join game: " + rejectReason);
                        this.disconnect();
                    }
                    return msg;
                };
                NetworkClient.prototype.processPing = function (data) {
                    var _this = this;
                    var msg = new PingMessage_1.default();
                    if (data.byteLength < msg.minimumDataLength) {
                        console.warn("Received invalid Ping message.");
                        return undefined;
                    }
                    msg.fromBytes(data, this._serverIsLittleEndian);
                    var receiveTime = window.performance.now();
                    this._delay = (receiveTime - this.pingTime) / 2000;
                    if (this._socketReady) {
                        this.pingTimeout = setTimeout(function () { return _this.ping(); }, this.pingInterval);
                    }
                    this.pingElement.innerText = Math.round(this._delay * 2000) + "";
                    console.log("Server average frame time: " + msg.avgFrameTime);
                    return msg;
                };
                NetworkClient.prototype.processStateUpdate = function (data) {
                    var msg = new StateUpdateMessage_1.default();
                    if (data.byteLength < msg.minimumDataLength) {
                        console.warn("Received invalid State Update message.");
                        return undefined;
                    }
                    msg.fromBytes(data, this._serverIsLittleEndian);
                    return msg;
                };
                NetworkClient.prototype.processPlayerInfo = function (data) {
                    var msg = new PlayerInfoMessage_1.default();
                    if (data.byteLength < msg.minimumDataLength) {
                        console.warn("Received invalid Player Info message.");
                        return undefined;
                    }
                    msg.fromBytes(data, this._serverIsLittleEndian);
                    return msg;
                };
                NetworkClient.prototype.connect = function () {
                    this.socket = new WebSocket(this.connectionUrl);
                    this.socket.binaryType = "arraybuffer";
                    this.socket.onopen = this.onSocketOpened.bind(this);
                    this.socket.onclose = this.onSocketClosed.bind(this);
                    this.socket.onerror = this.onSocketError.bind(this);
                    this.socket.onmessage = this.onSocketMessage.bind(this);
                };
                NetworkClient.prototype.disconnect = function () {
                    if (this.socket) {
                        this.socket.close();
                    }
                };
                NetworkClient.prototype.update = function (elapsed) {
                    this._clientTime += elapsed;
                    this._serverTime += elapsed;
                };
                NetworkClient.prototype.createInputMessage = function (input, sequence, player) {
                    var msg = new PlayerInputMessage_1.default();
                    msg.input = input;
                    msg.sequence = sequence;
                    msg.velocity = player.velocity.clone();
                    msg.lastJump = player.lastJump;
                    msg.lastDown = player.lastDown;
                    msg.moveRight = player.moveRight;
                    msg.moveLeft = player.moveLeft;
                    msg.moveDown = player.moveDown;
                    msg.jumping = player.jumping;
                    msg.running = player.running;
                    msg.pushedRightWall = player.pushedRightWall;
                    msg.pushesRightWall = player.pushesRightWall;
                    msg.pushedLeftWall = player.pushedLeftWall;
                    msg.pushesLeftWall = player.pushesLeftWall;
                    msg.wasOnGround = player.wasOnGround;
                    msg.onGround = player.onGround;
                    msg.wasAtCeiling = player.wasAtCeiling;
                    msg.atCeiling = player.atCeiling;
                    msg.onOneWayPlatform = player.onOneWayPlatform;
                    return msg;
                };
                NetworkClient.prototype.sendInput = function (msg) {
                    this.sendMessage(msg);
                };
                NetworkClient.prototype.getPlayerInfo = function (id) {
                    var msg = new PlayerInfoRequestMessage_1.default();
                    msg.id = id;
                    this.sendMessage(msg);
                };
                return NetworkClient;
            }());
            exports_28("default", NetworkClient);
        }
    };
});
System.register("Engine", ["InputManager", "Camera", "Vector", "Entity", "Constants", "Map", "Network/NetworkClient", "Utilities", "LocalPlayer"], function (exports_29, context_29) {
    "use strict";
    var InputManager_1, Camera_1, Vector_7, Entity_2, Constants_4, Map_1, NetworkClient_1, Utilities_4, LocalPlayer_1, Engine;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (InputManager_1_1) {
                InputManager_1 = InputManager_1_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (Vector_7_1) {
                Vector_7 = Vector_7_1;
            },
            function (Entity_2_1) {
                Entity_2 = Entity_2_1;
            },
            function (Constants_4_1) {
                Constants_4 = Constants_4_1;
            },
            function (Map_1_1) {
                Map_1 = Map_1_1;
            },
            function (NetworkClient_1_1) {
                NetworkClient_1 = NetworkClient_1_1;
            },
            function (Utilities_4_1) {
                Utilities_4 = Utilities_4_1;
            },
            function (LocalPlayer_1_1) {
                LocalPlayer_1 = LocalPlayer_1_1;
            }
        ],
        execute: function () {
            Engine = (function () {
                function Engine(canvas) {
                    var _this = this;
                    this.canvas = canvas;
                    this.clearColor = "#334";
                    this.hasPerfTimer = false;
                    this.renderTime = 0;
                    this.ready = false;
                    this.otherPlayers = [];
                    this.tickID = 0;
                    this.inputSequence = 0;
                    this.inputHistory = [];
                    this.lastInput = 0;
                    this.firstDraw = false;
                    this.inputTime = 0;
                    this.lastMsgTime = 0;
                    this.frameTimes = [];
                    this.context = this.canvas.getContext("2d");
                    var scheme = document.location.protocol === "https:" ? "wss" : "ws";
                    var port = document.location.port ? (":" + document.location.port) : "";
                    var connectionUrl = scheme + "://" + document.location.hostname + port;
                    this.networkClient = new NetworkClient_1.default(connectionUrl, 1000);
                    this.networkClient.fakeDelay = 0;
                    this.networkClient.onJoined = this.onJoined.bind(this);
                    this.networkClient.onMessage = this.onMessage.bind(this);
                    this.networkClient.connect();
                    this.camera = new Camera_1.default(this.context);
                    this.camera.distance = 2500;
                    this.setupInput();
                    if (window.performance && window.performance.now) {
                        this.hasPerfTimer = true;
                    }
                    window.addEventListener("resize", function () { return _this.updateCanvasSize(); });
                    this.updateCanvasSize();
                    this.player = new LocalPlayer_1.default(this, Vector_7.default.zero.clone(), new Vector_7.default(Constants_4.default.tileSize * 0.5 * 0.8, Constants_4.default.tileSize * 0.5 * 1.5));
                    this.player.position.x = Constants_4.default.tileSize * 30;
                    this.player.position.y = Constants_4.default.tileSize * 98;
                    this.player.drawPosition.x = Constants_4.default.tileSize * 30;
                    this.player.drawPosition.y = Constants_4.default.tileSize * 98;
                    this.camera.moveTo(this.player.position.x, this.player.position.y);
                    this.camera.follow(this.player.drawPosition, 0.1);
                    this.timerWorker = new Worker("/js/timer.js");
                    this.timerWorker.onmessage = function () { return _this.tick(); };
                    this.timerWorker.postMessage({ id: 1, type: "setInterval", time: 16 });
                }
                Engine.prototype.setupInput = function () {
                    this.input = new InputManager_1.default();
                    this.input.addInputAction(4, [65, 37]);
                    this.input.addInputAction(2, [68, 39]);
                    this.input.addInputAction(8, [87, 38]);
                    this.input.addInputAction(16, [83, 40]);
                    this.input.addInputAction(32, [32]);
                    this.input.addInputAction(64, [16]);
                    this.input.addInputAction(128, [74, 67]);
                    this.input.addInputAction(256, [75, 88]);
                    this.input.addInputAction(512, [76, 90]);
                    this.input.addInputAction(1024, [13, 32]);
                    this.input.addInputAction(2048, [27, 8]);
                };
                Engine.prototype.clearScreen = function (clearColor) {
                    this.context.fillStyle = clearColor;
                    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                };
                Engine.prototype.updateCanvasSize = function () {
                    this.canvas.width = this.canvas.clientWidth;
                    this.canvas.height = this.canvas.clientHeight;
                    this.camera.updateViewport();
                };
                Engine.prototype.drawRect = function (x, y, w, h, color) {
                    x -= w / 2;
                    y -= h / 2;
                    this.context.fillStyle = color;
                    this.context.fillRect(x, y, w, h);
                };
                Engine.prototype.drawName = function (name, x, y) {
                    this.context.fillStyle = "white";
                    this.context.font = "20px Arial";
                    var size = this.context.measureText(name);
                    this.context.fillText(name, x - (size.width * 0.5), y);
                };
                Engine.prototype.getElaspedTime = function () {
                    var now;
                    if (this.hasPerfTimer) {
                        now = window.performance.now();
                    }
                    else {
                        now = (new Date()).getTime();
                    }
                    if (this.lastUpdate === undefined) {
                        this.lastUpdate = now;
                    }
                    var elapsed = (now - this.lastUpdate) / 1000;
                    this.lastUpdate = now;
                    return elapsed;
                };
                Engine.prototype.tick = function () {
                    var elapsed = this.getElaspedTime();
                    if (elapsed > 0.020) {
                        console.warn("Tick time exceeded 20ms: " + elapsed);
                    }
                    if (!this.ready) {
                        this.networkClient.update(elapsed);
                        return;
                    }
                    if (elapsed >= 0.032) {
                        var remain = elapsed;
                        while (remain > 0.08) {
                            var tmpElapsed = Math.min(0.016, remain);
                            this.networkClient.update(tmpElapsed);
                            this.update(tmpElapsed);
                            remain -= 0.016;
                            this.tickID++;
                        }
                    }
                    else {
                        this.networkClient.update(elapsed);
                        this.update(elapsed);
                        this.tickID++;
                    }
                    if (!this.firstDraw) {
                        this.firstDraw = true;
                        this.draw();
                    }
                };
                Engine.prototype.update = function (elapsed) {
                    this.input.update(elapsed);
                    this.frameTimes.push(elapsed * 1000);
                    if (this.frameTimes.length > 100) {
                        var total = this.frameTimes.reduce(function (acc, cur) { return acc + cur; });
                        this.frameTimes.splice(0, this.frameTimes.length);
                    }
                    this.inputTime += elapsed;
                    var inputActions = 0;
                    for (var i = 0; i < Utilities_4.default.AllInputActions.length; i++) {
                        var action = Utilities_4.default.AllInputActions[i];
                        if (this.input.getAction(action)) {
                            inputActions |= action;
                        }
                    }
                    var msg = this.networkClient.createInputMessage(inputActions, ++this.inputSequence, this.player);
                    this.inputHistory.push(msg);
                    this.inputTime = 0;
                    this.lastMsgTime = 0;
                    this.networkClient.sendInput(msg);
                    this.lastMsgTime += elapsed;
                    this.lastInput = inputActions;
                    for (var e = this.otherPlayers.length - 1; e >= 0; e--) {
                        var entity = this.otherPlayers[e];
                        entity.lastUpdate += elapsed;
                        if (entity.lastUpdate >= 5) {
                            this.otherPlayers.splice(e, 1);
                        }
                    }
                    this.player.playerUpdate(inputActions, elapsed);
                    this.camera.update(elapsed);
                };
                Engine.prototype.lerpDrawPosition = function (drawPosition, realPosition, amount) {
                    var drawDist = Vector_7.default.subtract(drawPosition, realPosition).length();
                    if (drawDist > 100) {
                        drawPosition.copyFrom(realPosition);
                    }
                    else if (drawDist > 0) {
                        if (drawDist <= 1) {
                            drawPosition.copyFrom(realPosition);
                        }
                        else {
                            Vector_7.default.lerp(drawPosition, realPosition, amount, drawPosition);
                        }
                    }
                    else if (drawDist < 0) {
                        drawPosition.copyFrom(realPosition);
                    }
                };
                Engine.prototype.draw = function () {
                    var _this = this;
                    this.clearScreen(this.clearColor);
                    this.lerpDrawPosition(this.player.drawPosition, this.player.position, 0.65);
                    this.camera.begin();
                    for (var y = 0; y < this.map.height; y++) {
                        for (var x = 0; x < this.map.width; x++) {
                            var tile = this.map.tiles[y][x];
                            if (tile === 0) {
                                continue;
                            }
                            else if (tile === 1) {
                                this.drawRect(x * Constants_4.default.tileSize, y * Constants_4.default.tileSize, Constants_4.default.tileSize, Constants_4.default.tileSize, "#351E0B");
                            }
                            else if (tile === 2) {
                                this.drawRect(x * Constants_4.default.tileSize, y * Constants_4.default.tileSize - Constants_4.default.tileSize * 0.25, Constants_4.default.tileSize, Constants_4.default.tileSize * 0.5, "#6A3F1C");
                            }
                        }
                    }
                    var playerSize = this.player.aabb.getSize();
                    var delEntities = [];
                    for (var _i = 0, _a = this.otherPlayers; _i < _a.length; _i++) {
                        var e = _a[_i];
                        if (!e.ready) {
                            continue;
                        }
                        this.lerpDrawPosition(e.drawPosition, e.position, 0.55);
                        this.drawRect(e.drawPosition.x, e.drawPosition.y, playerSize.x * this.player.scale.x, playerSize.y * this.player.scale.y, e.color.css);
                        this.drawName(e.name, e.drawPosition.x, e.drawPosition.y - playerSize.y);
                    }
                    this.drawRect(this.player.position.x, this.player.position.y, playerSize.x * this.player.scale.x, playerSize.y * this.player.scale.y, this.player.color.css);
                    this.drawName(this.player.name, this.player.position.x, this.player.position.y - playerSize.y);
                    this.camera.end();
                    window.fpsMeter.tick();
                    requestAnimationFrame(function () { return _this.draw(); });
                };
                Engine.prototype.onJoined = function (id, name, color) {
                    this.player.id = id;
                    this.player.name = name;
                    this.player.color = color;
                };
                Engine.prototype.onMessage = function (msg) {
                    if (msg.messageType === 9) {
                        this.processStateUpdate(msg);
                    }
                    else if (msg.messageType === 11) {
                        this.updatePlayerInfo(msg);
                    }
                    else if (msg.messageType === 2) {
                        this.loadMap(msg.mapID);
                        this.player.ready = true;
                    }
                };
                Engine.prototype.loadMap = function (id) {
                    var self = this;
                    axios.get("/maps/" + id + ".json")
                        .then(function (response) {
                        self.map = new Map_1.Map(response.data.Name, response.data.Width, response.data.Height);
                        self.map.loadData(response.data.Tiles);
                        self.ready = true;
                    })
                        .catch(function (error) {
                        console.error(error);
                    });
                };
                Engine.prototype.processStateUpdate = function (state) {
                    if (!this.ready) {
                        return;
                    }
                    for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
                        var p = _a[_i];
                        if (p.id === this.player.id) {
                            this.serverReconciliation(p);
                        }
                        else {
                            this.updateOtherPlayer(p);
                        }
                    }
                };
                Engine.prototype.rewindPlayer = function (input) {
                    this.player.lastJump = input.lastJump;
                    this.player.lastDown = input.lastDown;
                    this.player.moveRight = input.moveRight;
                    this.player.moveLeft = input.moveLeft;
                    this.player.moveDown = input.moveDown;
                    this.player.jumping = input.jumping;
                    this.player.running = input.running;
                    this.player.pushedRightWall = input.pushedRightWall;
                    this.player.pushesRightWall = input.pushesRightWall;
                    this.player.pushedLeftWall = input.pushedLeftWall;
                    this.player.pushesLeftWall = input.pushesLeftWall;
                    this.player.wasOnGround = input.wasOnGround;
                    this.player.onGround = input.onGround;
                    this.player.wasAtCeiling = input.wasAtCeiling;
                    this.player.atCeiling = input.atCeiling;
                    this.player.onOneWayPlatform = input.onOneWayPlatform;
                };
                Engine.prototype.serverReconciliation = function (msg) {
                    this.player.serverPosition.x = msg.positionX;
                    this.player.serverPosition.y = msg.positionY;
                    this.player.position.x = msg.positionX;
                    this.player.position.y = msg.positionY;
                    this.player.velocity.x = msg.velocityX;
                    this.player.velocity.y = msg.velocityY;
                    while (this.inputHistory.length && this.inputHistory[0].sequence <= msg.sequence) {
                        this.inputHistory.shift();
                    }
                    if (this.inputHistory.length === 0) {
                        return;
                    }
                    this.rewindPlayer(this.inputHistory[0]);
                    for (var i = 0; i < this.inputHistory.length; i++) {
                        var input = this.inputHistory[i];
                        this.player.playerUpdate(input.input, 0.016);
                    }
                };
                Engine.prototype.updatePlayerInfo = function (msg) {
                    var op = this.otherPlayers.filter(function (e, i) { return e.id === msg.id; });
                    if (op.length) {
                        op[0].name = msg.name;
                        op[0].color = msg.color;
                        op[0].ready = true;
                    }
                };
                Engine.prototype.updateOtherPlayer = function (msg) {
                    var op = this.otherPlayers.filter(function (e, i) { return e.id === msg.id; });
                    if (op.length) {
                        op[0].position.x = msg.positionX;
                        op[0].position.y = msg.positionY;
                        op[0].lastUpdate = 0;
                    }
                    else {
                        this.networkClient.getPlayerInfo(msg.id);
                        var entity = new Entity_2.default(this, new Vector_7.default(msg.positionX, msg.positionY), new Vector_7.default(Constants_4.default.tileSize * 0.5 * 0.8, Constants_4.default.tileSize * 0.5 * 1.5));
                        entity.id = msg.id;
                        this.otherPlayers.push(entity);
                    }
                };
                return Engine;
            }());
            exports_29("default", Engine);
        }
    };
});
System.register("App", ["Engine"], function (exports_30, context_30) {
    "use strict";
    var Engine_1, App;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (Engine_1_1) {
                Engine_1 = Engine_1_1;
            }
        ],
        execute: function () {
            App = (function () {
                function App(canvasID) {
                    this.canvas = document.getElementById(canvasID);
                    this.engine = new Engine_1.default(this.canvas);
                }
                return App;
            }());
            exports_30("default", new App("game"));
        }
    };
});
System.register("IDrawable", [], function (exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL0NsaWVudEFwcC9JUG9pbnQudHMiLCIuLi8uLi9DbGllbnRBcHAvVmVjdG9yLnRzIiwiLi4vLi4vQ2xpZW50QXBwL0FBQkIudHMiLCIuLi8uLi9DbGllbnRBcHAvSW5wdXRNYW5hZ2VyLnRzIiwiLi4vLi4vQ2xpZW50QXBwL0NhbWVyYS50cyIsIi4uLy4uL0NsaWVudEFwcC9Db25zdGFudHMudHMiLCIuLi8uLi9DbGllbnRBcHAvRGlyZWN0aW9uLnRzIiwiLi4vLi4vQ2xpZW50QXBwL01hcC50cyIsIi4uLy4uL0NsaWVudEFwcC9JbnB1dEFjdGlvblR5cGUudHMiLCIuLi8uLi9DbGllbnRBcHAvVXRpbGl0aWVzLnRzIiwiLi4vLi4vQ2xpZW50QXBwL0NvbG9yLnRzIiwiLi4vLi4vQ2xpZW50QXBwL01vdmluZ09iamVjdC50cyIsIi4uLy4uL0NsaWVudEFwcC9FbnRpdHlTdGF0ZS50cyIsIi4uLy4uL0NsaWVudEFwcC9FbnRpdHkudHMiLCIuLi8uLi9DbGllbnRBcHAvTmV0d29yay9NZXNzYWdlcy9NZXNzYWdlVHlwZS50cyIsIi4uLy4uL0NsaWVudEFwcC9OZXR3b3JrL01lc3NhZ2VzL0lNZXNzYWdlLnRzIiwiLi4vLi4vQ2xpZW50QXBwL05ldHdvcmsvTWVzc2FnZXMvUGluZ01lc3NhZ2UudHMiLCIuLi8uLi9DbGllbnRBcHAvTmV0d29yay9NZXNzYWdlcy9SZWplY3RSZWFzb24udHMiLCIuLi8uLi9DbGllbnRBcHAvTmV0d29yay9OZXR3b3JrSGVscGVyLnRzIiwiLi4vLi4vQ2xpZW50QXBwL05ldHdvcmsvTWVzc2FnZXMvSm9pbkFjY2VwdGVkTWVzc2FnZS50cyIsIi4uLy4uL0NsaWVudEFwcC9OZXR3b3JrL01lc3NhZ2VzL0pvaW5SZXF1ZXN0TWVzc2FnZS50cyIsIi4uLy4uL0NsaWVudEFwcC9OZXR3b3JrL01lc3NhZ2VzL1BsYXllcklucHV0TWVzc2FnZS50cyIsIi4uLy4uL0NsaWVudEFwcC9OZXR3b3JrL01lc3NhZ2VzL1Bvc2l0aW9uTWVzc2FnZS50cyIsIi4uLy4uL0NsaWVudEFwcC9Mb2NhbFBsYXllci50cyIsIi4uLy4uL0NsaWVudEFwcC9OZXR3b3JrL01lc3NhZ2VzL1N0YXRlVXBkYXRlTWVzc2FnZS50cyIsIi4uLy4uL0NsaWVudEFwcC9OZXR3b3JrL01lc3NhZ2VzL1BsYXllckluZm9NZXNzYWdlLnRzIiwiLi4vLi4vQ2xpZW50QXBwL05ldHdvcmsvTWVzc2FnZXMvUGxheWVySW5mb1JlcXVlc3RNZXNzYWdlLnRzIiwiLi4vLi4vQ2xpZW50QXBwL05ldHdvcmsvTmV0d29ya0NsaWVudC50cyIsIi4uLy4uL0NsaWVudEFwcC9FbmdpbmUudHMiLCIuLi8uLi9DbGllbnRBcHAvQXBwLnRzIiwiLi4vLi4vQ2xpZW50QXBwL0lEcmF3YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDTUksZ0JBQVksQ0FBVSxFQUFFLENBQVU7b0JBQzlCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixDQUFDO2dCQUdNLHlCQUFRLEdBQWYsVUFBZ0IsS0FBYTtvQkFDekIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLE9BQU8sSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUdNLG9CQUFHLEdBQVYsVUFBVyxLQUFhO29CQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBR00seUJBQVEsR0FBZixVQUFn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bnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIElQb2ludCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbn0iLCJpbXBvcnQgSVBvaW50IGZyb20gXCIuL0lQb2ludFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjdG9yIGltcGxlbWVudHMgSVBvaW50IHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg/OiBudW1iZXIsIHk/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBNb2RpZmllcyB0aGlzIHZlY3RvciAqL1xyXG4gICAgcHVibGljIGNvcHlGcm9tKG90aGVyOiBWZWN0b3IpIHtcclxuICAgICAgICB0aGlzLnggPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSA9IG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIE1vZGlmaWVzIHRoaXMgdmVjdG9yICovXHJcbiAgICBwdWJsaWMgYWRkKG90aGVyOiBWZWN0b3IpIHtcclxuICAgICAgICB0aGlzLnggKz0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgKz0gb3RoZXIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogTW9kaWZpZXMgdGhpcyB2ZWN0b3IgKi9cclxuICAgIHB1YmxpYyBzdWJ0cmFjdChvdGhlcjogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy54IC09IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55IC09IG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIE1vZGlmaWVzIHRoaXMgdmVjdG9yICovXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCAqPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnkgKj0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIE1vZGlmaWVzIHRoaXMgdmVjdG9yICovXHJcbiAgICBwdWJsaWMgcm91bmQoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yb3VuZCh0aGlzLngpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgucm91bmQodGhpcy55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkb3Qob3RoZXI6IFZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiBvdGhlci54ICsgdGhpcy55ICogb3RoZXIueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVuZ3RoU3F1YXJlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXN0YW5jZShvdGhlcjogVmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHRoaXMueCAtIG90aGVyLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueSAtIG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzdGFuY2VTcXVhcmVkKG90aGVyOiBWZWN0b3IpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54IC0gb3RoZXIueDtcclxuICAgICAgICBjb25zdCB5ID0gdGhpcy55IC0gb3RoZXIueTtcclxuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWRkKGE6IFZlY3RvciwgYjogVmVjdG9yLCBvdXQ/OiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgICAgIGlmICghb3V0KSBvdXQgPSBuZXcgVmVjdG9yKCk7XHJcbiAgICAgICAgb3V0LnggPSBhLnggKyBiLng7XHJcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3VidHJhY3QoYTogVmVjdG9yLCBiOiBWZWN0b3IsIG91dD86IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICAgICAgaWYgKCFvdXQpIG91dCA9IG5ldyBWZWN0b3IoKTtcclxuICAgICAgICBvdXQueCA9IGEueCAtIGIueDtcclxuICAgICAgICBvdXQueSA9IGEueSAtIGIueTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtdWx0aXBseShhOiBWZWN0b3IsIHZhbHVlOiBudW1iZXIsIG91dD86IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICAgICAgaWYgKCFvdXQpIG91dCA9IG5ldyBWZWN0b3IoKTtcclxuICAgICAgICBvdXQueCA9IGEueCAqIHZhbHVlO1xyXG4gICAgICAgIG91dC55ID0gYS55ICogdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZG90KGE6IFZlY3RvciwgYjogVmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGEuZG90KGIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsZXJwKGE6IFZlY3RvciwgYjogVmVjdG9yLCB0OiBudW1iZXIsIG91dD86IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICAgICAgaWYgKCFvdXQpIG91dCA9IG5ldyBWZWN0b3IoKTtcclxuICAgICAgICBvdXQueCA9IGEueCArIHQgKiAoYi54IC0gYS54KTtcclxuICAgICAgICBvdXQueSA9IGEueSArIHQgKiAoYi55IC0gYS55KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjbG9uZShzb3VyY2U6IFZlY3Rvciwgb3V0PzogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgICAgICBpZiAob3V0KSB7XHJcbiAgICAgICAgICAgIG91dC5jb3B5RnJvbShzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3Ioc291cmNlLngsIHNvdXJjZS55KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbVBvaW50KHB0OiBJUG9pbnQsIG91dD86IFZlY3Rvcikge1xyXG4gICAgICAgIGlmICghb3V0KSBvdXQgPSBuZXcgVmVjdG9yKCk7XHJcbiAgICAgICAgb3V0LnggPSBwdC54O1xyXG4gICAgICAgIG91dC55ID0gcHQueTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByb3VuZChzb3VyY2U6IFZlY3Rvciwgb3V0PzogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgICAgICBpZiAoIW91dCkgb3V0ID0gbmV3IFZlY3RvcigpO1xyXG4gICAgICAgIG91dC54ID0gTWF0aC5yb3VuZChzb3VyY2UueCk7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLnJvdW5kKHNvdXJjZS55KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSB6ZXJvID0gbmV3IFZlY3RvcigwLCAwKTtcclxuICAgIHN0YXRpYyByZWFkb25seSBvbmUgPSBuZXcgVmVjdG9yKDEsIDEpO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHJpZ2h0ID0gbmV3IFZlY3RvcigxLCAwKTtcclxuICAgIHN0YXRpYyByZWFkb25seSBsZWZ0ID0gbmV3IFZlY3RvcigtMSwgMCk7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdXAgPSBuZXcgVmVjdG9yKDAsIC0xKTtcclxuICAgIHN0YXRpYyByZWFkb25seSBkb3duID0gbmV3IFZlY3RvcigwLCAxKTtcclxufSIsImltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XHJcbmltcG9ydCBJUG9pbnQgZnJvbSBcIi4vSVBvaW50XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBQUJCIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjZW50ZXI6IFZlY3RvciwgcHVibGljIGhhbGZTaXplOiBWZWN0b3IpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG92ZXJsYXBzKG90aGVyOiBBQUJCKSB7XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuY2VudGVyLnggLSBvdGhlci5jZW50ZXIueCkgPiB0aGlzLmhhbGZTaXplLnggKyBvdGhlci5oYWxmU2l6ZS54KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuY2VudGVyLnkgLSBvdGhlci5jZW50ZXIueSkgPiB0aGlzLmhhbGZTaXplLnkgKyBvdGhlci5oYWxmU2l6ZS55KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNpemUoKTogSVBvaW50IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLmhhbGZTaXplLnggKiAyLFxyXG4gICAgICAgICAgICB5OiB0aGlzLmhhbGZTaXplLnkgKiAyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsImNsYXNzIElucHV0U3RhdGUge1xyXG4gICAgcHVibGljIHByZXNzZWQgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBuZXdTdGF0ZSA9IGZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRlVGltZSA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGtleXM6IEFycmF5PG51bWJlcj4pIHsgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dE1hbmFnZXIge1xyXG5cclxuICAgIHByaXZhdGUga2V5U3RhdGVzOiBBcnJheTxib29sZWFuPiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBpbnB1dEFjdGlvblN0YXRlczogQXJyYXk8SW5wdXRTdGF0ZT4gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXYpIHsgcmV0dXJuIHNlbGYub25LZXlFdmVudChldiwgZXYua2V5Q29kZSwgdHJ1ZSk7IH0sIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2KSB7IHJldHVybiBzZWxmLm9uS2V5RXZlbnQoZXYsIGV2LmtleUNvZGUsIGZhbHNlKTsgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25LZXlFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCwga2V5OiBudW1iZXIsIGRvd246IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmtleVN0YXRlc1trZXldID0gZG93bjtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUlucHV0QWN0aW9uKGlkOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5pbnB1dEFjdGlvblN0YXRlcy5sZW5ndGggPj0gaWQgfHwgdHlwZW9mICh0aGlzLmlucHV0QWN0aW9uU3RhdGVzW2lkXSkgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEFjdGlvblN0YXRlc1tpZF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRJbnB1dEFjdGlvbihpZDogbnVtYmVyLCBrZXlzOiBBcnJheTxudW1iZXI+KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRBY3Rpb25TdGF0ZXMubGVuZ3RoID49IGlkIHx8IHRoaXMuaW5wdXRBY3Rpb25TdGF0ZXNbaWRdID09PSB1bmRlZmluZWQgfHwgdGhpcy5pbnB1dEFjdGlvblN0YXRlc1tpZF0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgdGhpc0tleXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzS2V5cy5wdXNoKGtleXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRBY3Rpb25TdGF0ZXNbaWRdID0gbmV3IElucHV0U3RhdGUodGhpc0tleXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBpbnB1dDogSW5wdXRTdGF0ZSxcclxuICAgICAgICAgICAga2V5OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGFueURvd246IGJvb2xlYW47XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLmlucHV0QWN0aW9uU3RhdGVzKSB7XHJcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5pbnB1dEFjdGlvblN0YXRlc1tpXTtcclxuICAgICAgICAgICAgYW55RG93biA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgaW4gaW5wdXQua2V5cykge1xyXG4gICAgICAgICAgICAgICAga2V5ID0gaW5wdXQua2V5c1trXTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmtleVN0YXRlc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW55RG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhbnlEb3duID09PSBpbnB1dC5wcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBFeGlzdGluZyBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgaW5wdXQuc3RhdGVUaW1lICs9IGVsYXBzZWQ7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC5uZXdTdGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gTmV3IHN0YXRlXHJcbiAgICAgICAgICAgICAgICBpbnB1dC5zdGF0ZVRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgaW5wdXQubmV3U3RhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaW5wdXQucHJlc3NlZCA9IGFueURvd247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHVybnMgdHJ1ZSB3aGlsZSB0aGUgYWN0aW9uIGlzIGhlbGQgZG93bi4gKi9cclxuICAgIHB1YmxpYyBnZXRBY3Rpb24oaWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0QWN0aW9uU3RhdGVzW2lkXS5wcmVzc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBSZXR1cm5zIHRydWUgZHVyaW5nIHRoZSBmcmFtZSB0aGUgYWN0aW9uIHdhcyBwcmVzc2VkLiAqL1xyXG4gICAgcHVibGljIGdldEFjdGlvbkRvd24oaWQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5pbnB1dEFjdGlvblN0YXRlc1tpZF07XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlLnByZXNzZWQgJiYgc3RhdGUubmV3U3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBkdXJpbmcgdGhlIGZyYW1lIHRoZSBhY3Rpb24gd2FzIHJlbGVhc2VkLiAqL1xyXG4gICAgcHVibGljIGdldEFjdGlvblVwKGlkOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuaW5wdXRBY3Rpb25TdGF0ZXNbaWRdO1xyXG4gICAgICAgIHJldHVybiAhc3RhdGUucHJlc3NlZCAmJiBzdGF0ZS5uZXdTdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SW5wdXRTdGF0ZShpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRBY3Rpb25TdGF0ZXNbaWRdO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XHJcbmltcG9ydCBJUG9pbnQgZnJvbSBcIi4vSVBvaW50XCI7XHJcblxyXG4vLyBCb3Jyb3dlZCBoZWF2aWx5IGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9yb2Jhc2h0b24vY2FtZXJhXHJcblxyXG5jbGFzcyBWaWV3cG9ydCB7XHJcbiAgICBsZWZ0OiBudW1iZXIgPSAwO1xyXG4gICAgcmlnaHQ6IG51bWJlciA9IDA7XHJcbiAgICB0b3A6IG51bWJlciA9IDA7XHJcbiAgICBib3R0b206IG51bWJlciA9IDA7XHJcbiAgICB3aWR0aDogbnVtYmVyID0gMDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMDtcclxuICAgIHNjYWxlOiBWZWN0b3IgPSBuZXcgVmVjdG9yKDEsIDEpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW1lcmEge1xyXG4gICAgZGlzdGFuY2U6IG51bWJlcjtcclxuICAgIHBvc2l0aW9uOiBWZWN0b3I7XHJcbiAgICBmaWVsZE9mVmlldzogbnVtYmVyO1xyXG4gICAgdmlld3BvcnQ6IFZpZXdwb3J0O1xyXG4gICAgYXNwZWN0UmF0aW86IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIF9pc0ZvbGxvd2luZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfZm9sbG93VGFyZ2V0OiBWZWN0b3I7XHJcbiAgICBwcml2YXRlIF9mb2xsb3dTcGVlZDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZm9sbG93T2Zmc2V0OiBWZWN0b3I7XHJcblxyXG4gICAgZ2V0IGlzRm9sbG93aW5nKCkgeyByZXR1cm4gdGhpcy5faXNGb2xsb3dpbmc7IH1cclxuICAgIGdldCBmb2xsb3dUYXJnZXQoKSB7IHJldHVybiB0aGlzLl9mb2xsb3dUYXJnZXQ7IH1cclxuICAgIGdldCBmb2xsb3dTcGVlZCgpIHsgcmV0dXJuIHRoaXMuX2ZvbGxvd1NwZWVkOyB9XHJcbiAgICBnZXQgZm9sbG93T2Zmc2V0KCkgeyByZXR1cm4gdGhpcy5fZm9sbG93T2Zmc2V0OyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yKDAsIDApO1xyXG4gICAgICAgIHRoaXMuZmllbGRPZlZpZXcgPSBNYXRoLlBJIC8gNC4wO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgVmlld3BvcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3cG9ydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZpZXdwb3J0KCkge1xyXG4gICAgICAgIHRoaXMuYXNwZWN0UmF0aW8gPSB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoIC8gdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC53aWR0aCA9IHRoaXMuZGlzdGFuY2UgKiBNYXRoLnRhbih0aGlzLmZpZWxkT2ZWaWV3KTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmhlaWdodCA9IHRoaXMudmlld3BvcnQud2lkdGggLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQubGVmdCA9IHRoaXMucG9zaXRpb24ueCAtICh0aGlzLnZpZXdwb3J0LndpZHRoIC8gMi4wKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LnRvcCA9IHRoaXMucG9zaXRpb24ueSAtICh0aGlzLnZpZXdwb3J0LmhlaWdodCAvIDIuMCk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5yaWdodCA9IHRoaXMudmlld3BvcnQubGVmdCArIHRoaXMudmlld3BvcnQud2lkdGg7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5ib3R0b20gPSB0aGlzLnZpZXdwb3J0LnRvcCArIHRoaXMudmlld3BvcnQuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQuc2NhbGUueCA9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGggLyB0aGlzLnZpZXdwb3J0LndpZHRoO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQuc2NhbGUueSA9IHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gdGhpcy52aWV3cG9ydC5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgYmVnaW4oKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICB0aGlzLmFwcGx5U2NhbGUoKTtcclxuICAgICAgICB0aGlzLmFwcGx5VHJhbnNsYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBlbmQoKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseVNjYWxlKCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5zY2FsZSh0aGlzLnZpZXdwb3J0LnNjYWxlLngsIHRoaXMudmlld3BvcnQuc2NhbGUueSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlUcmFuc2xhdGlvbigpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKC10aGlzLnZpZXdwb3J0LmxlZnQsIC10aGlzLnZpZXdwb3J0LnRvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgem9vbVRvKHo6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSB6O1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld3BvcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3cG9ydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNjcmVlblRvV29ybGQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHB0OiBJUG9pbnQpOiBJUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6ICh4IC8gdGhpcy52aWV3cG9ydC5zY2FsZS54KSArIHRoaXMudmlld3BvcnQubGVmdCxcclxuICAgICAgICAgICAgeTogKHkgLyB0aGlzLnZpZXdwb3J0LnNjYWxlLnkpICsgdGhpcy52aWV3cG9ydC50b3AsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB3b3JsZFRvU2NyZWVuKHg6IG51bWJlciwgeTogbnVtYmVyLCBwdDogSVBvaW50KTogSVBvaW50IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiAoeCAtIHRoaXMudmlld3BvcnQubGVmdCkgKiAodGhpcy52aWV3cG9ydC5zY2FsZS54KSxcclxuICAgICAgICAgICAgeTogKHkgLSB0aGlzLnZpZXdwb3J0LnRvcCkgKiAodGhpcy52aWV3cG9ydC5zY2FsZS55KSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZvbGxvdyh0YXJnZXQ6IFZlY3Rvciwgc3BlZWQ/OiBudW1iZXIsIG9mZnNldD86IFZlY3Rvcikge1xyXG4gICAgICAgIGlmIChzcGVlZCkge1xyXG4gICAgICAgICAgICBpZiAoc3BlZWQgPD0gMCB8fCBzcGVlZCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW1lcmEuZm9sbG93KCkgYXJndW1lbnQgJ3NwZWVkJyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiB6ZXJvIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gMS5cIik7XHJcbiAgICAgICAgICAgICAgICBzcGVlZCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBObyBzbW9vdGhuZXNzLlxyXG4gICAgICAgICAgICBzcGVlZCA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9mb2xsb3dUYXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5fZm9sbG93U3BlZWQgPSBzcGVlZDtcclxuXHJcbiAgICAgICAgaWYgKG9mZnNldCkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb2xsb3dPZmZzZXQgPSBvZmZzZXQuY2xvbmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9mb2xsb3dPZmZzZXQgPSBWZWN0b3IuemVyby5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdG9wRm9sbG93aW5nKCkge1xyXG4gICAgICAgIHRoaXMuX2ZvbGxvd1RhcmdldCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZWxhcHNlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9mb2xsb3dUYXJnZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRhcmdldFBvcyA9IFZlY3Rvci5hZGQodGhpcy5fZm9sbG93VGFyZ2V0LCB0aGlzLl9mb2xsb3dPZmZzZXQpO1xyXG4gICAgICAgIFZlY3Rvci5sZXJwKHRoaXMucG9zaXRpb24sIHRhcmdldFBvcywgdGhpcy5fZm9sbG93U3BlZWQsIHRoaXMucG9zaXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdwb3J0KCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zdGFudHMge1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG5ldHdvcmtQcmVjaXNpb24gPSAzO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRpbGVTaXplID0gMzI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaGFsZlRpbGUgPSBDb25zdGFudHMudGlsZVNpemUgLyAyO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGdyYXZpdHkgPSBDb25zdGFudHMudGlsZVNpemUgKiAxMjA7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVmYXVsdFdhbGtTcGVlZCA9IENvbnN0YW50cy50aWxlU2l6ZSAqIDEwO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRKdW1wU3BlZWQgPSAtQ29uc3RhbnRzLnRpbGVTaXplICogMzI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbWF4RmFsbFNwZWVkID0gQ29uc3RhbnRzLnRpbGVTaXplICogMTAwO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRBY2NlbCA9IENvbnN0YW50cy50aWxlU2l6ZSAqIDEwMDtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZWZhdWx0RGVjZWwgPSBDb25zdGFudHMudGlsZVNpemUgKiAxNTA7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgb25lV2F5UGxhdGZvcm1UaHJlc2hvbGQgPSAyO1xyXG59IiwiZXhwb3J0IGNvbnN0IGVudW0gRGlyZWN0aW9uIHtcclxuICAgIFJpZ2h0LFxyXG4gICAgTGVmdFxyXG59IiwiaW1wb3J0IFZlY3RvciBmcm9tIFwiLi9WZWN0b3JcIjtcclxuaW1wb3J0IElQb2ludCBmcm9tIFwiLi9JUG9pbnRcIjtcclxuaW1wb3J0IENvbnN0YW50cyBmcm9tIFwiLi9Db25zdGFudHNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBlbnVtIE1hcFRpbGVUeXBlIHtcclxuICAgIEVtcHR5LFxyXG4gICAgQmxvY2ssXHJcbiAgICBPbmVXYXlcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hcCB7XHJcbiAgICBwdWJsaWMgcG9zaXRpb246IFZlY3RvciA9IFZlY3Rvci56ZXJvLmNsb25lKCk7XHJcbiAgICBwdWJsaWMgdGlsZXM6IEFycmF5PEFycmF5PE1hcFRpbGVUeXBlPj47XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHdpZHRoOiBudW1iZXIsIHB1YmxpYyBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudGlsZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvdzogQXJyYXk8TWFwVGlsZVR5cGU+ID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaChyb3cpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gTWFwVGlsZVR5cGUuRW1wdHk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9pZiAoeCA9PT0gMCB8fCB5ID09PSAwIHx8IHggPj0gd2lkdGggLSAxIHx8IHkgPj0gaGVpZ2h0IC0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgdHlwZSA9IE1hcFRpbGVUeXBlLkJsb2NrO1xyXG4gICAgICAgICAgICAgICAgLy99IGVsc2UgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjEpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC44KSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdHlwZSA9IE1hcFRpbGVUeXBlLk9uZVdheTtcclxuICAgICAgICAgICAgICAgIC8vICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdHlwZSA9IE1hcFRpbGVUeXBlLkJsb2NrO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICAgICAgcm93LnB1c2godHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWREYXRhKGRhdGE6IEFycmF5PEFycmF5PE1hcFRpbGVUeXBlPj4pIHtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy50aWxlc1t5XTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHJvd1t4XSA9IGRhdGFbeV1beF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRpbGVQb3NBdFBvaW50KHB0OiBWZWN0b3IpOiBJUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IE1hdGguZmxvb3IoKHB0LnggLSB0aGlzLnBvc2l0aW9uLnggKyBDb25zdGFudHMudGlsZVNpemUgLyAyKSAvIENvbnN0YW50cy50aWxlU2l6ZSksXHJcbiAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoKHB0LnkgLSB0aGlzLnBvc2l0aW9uLnkgKyBDb25zdGFudHMudGlsZVNpemUgLyAyKSAvIENvbnN0YW50cy50aWxlU2l6ZSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNYXBUaWxlWUF0UG9pbnQoeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHkgLSB0aGlzLnBvc2l0aW9uLnkgKyBDb25zdGFudHMudGlsZVNpemUgLyAyKSAvIENvbnN0YW50cy50aWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE1hcFRpbGVYQXRQb2ludCh4OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoeCAtIHRoaXMucG9zaXRpb24ueCArIENvbnN0YW50cy50aWxlU2l6ZSAvIDIpIC8gQ29uc3RhbnRzLnRpbGVTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TWFwVGlsZVBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoXHJcbiAgICAgICAgICAgIHggKiBDb25zdGFudHMudGlsZVNpemUgKyB0aGlzLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgIHkgKiBDb25zdGFudHMudGlsZVNpemUgKyB0aGlzLnBvc2l0aW9uLnksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VGlsZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh4IDwgMCB8fCB4ID49IHRoaXMud2lkdGggfHwgeSA8IDAgfHwgeSA+PSB0aGlzLmhlaWdodClcclxuICAgICAgICAgICAgcmV0dXJuIE1hcFRpbGVUeXBlLkJsb2NrO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50aWxlc1t5XVt4XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNPYnN0YWNsZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRpbGUoeCwgeSkgPT09IE1hcFRpbGVUeXBlLkJsb2NrO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0dyb3VuZCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmdldFRpbGUoeCwgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRpbGUgPT09IE1hcFRpbGVUeXBlLkJsb2NrIHx8IHRpbGUgPT09IE1hcFRpbGVUeXBlLk9uZVdheTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjb25zdCBlbnVtIElucHV0QWN0aW9uVHlwZSB7XHJcbiAgICBOb25lICAgID0gMCxcclxuICAgIFJpZ2h0ICAgPSAxIDw8IDEsXHJcbiAgICBMZWZ0ICAgID0gMSA8PCAyLFxyXG4gICAgVXAgICAgICA9IDEgPDwgMyxcclxuICAgIERvd24gICAgPSAxIDw8IDQsXHJcbiAgICBKdW1wICAgID0gMSA8PCA1LFxyXG4gICAgUnVuICAgICA9IDEgPDwgNixcclxuICAgIEFjdGlvbjEgPSAxIDw8IDcsXHJcbiAgICBBY3Rpb24yID0gMSA8PCA4LFxyXG4gICAgQWN0aW9uMyA9IDEgPDwgOSxcclxuICAgIFNlbGVjdCAgPSAxIDw8IDEwLFxyXG4gICAgQ2FuY2VsICA9IDEgPDwgMTFcclxufSIsImltcG9ydCB7IElucHV0QWN0aW9uVHlwZSB9IGZyb20gXCIuL0lucHV0QWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgVmVjdG9yIGZyb20gXCIuL1ZlY3RvclwiO1xyXG5pbXBvcnQgQ29uc3RhbnRzIGZyb20gXCIuL0NvbnN0YW50c1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbGl0aWVzIHtcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gRW51bSBmbGFnIHV0aWxpdGllc1xyXG4gICAgcHVibGljIHN0YXRpYyBGbGFnVGVzdChjdXJyZW50VmFsdWU6IG51bWJlciwgZmxhZzogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZSAmIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBGbGFnU2V0KGN1cnJlbnRWYWx1ZTogbnVtYmVyLCBmbGFnOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlIHwgZmxhZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZsYWdVbnNldChjdXJyZW50VmFsdWU6IG51bWJlciwgZmxhZzogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZSAmIH5mbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBJbnB1dFxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBBbGxJbnB1dEFjdGlvbnMgPSBbXHJcbiAgICAgICAgSW5wdXRBY3Rpb25UeXBlLlJpZ2h0LFxyXG4gICAgICAgIElucHV0QWN0aW9uVHlwZS5MZWZ0LFxyXG4gICAgICAgIElucHV0QWN0aW9uVHlwZS5VcCxcclxuICAgICAgICBJbnB1dEFjdGlvblR5cGUuRG93bixcclxuICAgICAgICBJbnB1dEFjdGlvblR5cGUuSnVtcCxcclxuICAgICAgICBJbnB1dEFjdGlvblR5cGUuUnVuLFxyXG4gICAgICAgIElucHV0QWN0aW9uVHlwZS5BY3Rpb24xLFxyXG4gICAgICAgIElucHV0QWN0aW9uVHlwZS5BY3Rpb24yLFxyXG4gICAgICAgIElucHV0QWN0aW9uVHlwZS5BY3Rpb24zLFxyXG4gICAgICAgIElucHV0QWN0aW9uVHlwZS5TZWxlY3QsXHJcbiAgICAgICAgSW5wdXRBY3Rpb25UeXBlLkNhbmNlbFxyXG4gICAgXTtcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gUm91bmRpbmcgKGJldHRlciBuZXR3b3JrIHJlY29uY2lsaWF0aW9uKVxyXG4gICAgcHVibGljIHN0YXRpYyByb3VuZE51bWJlcih2YWw6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbC50b0ZpeGVkKENvbnN0YW50cy5uZXR3b3JrUHJlY2lzaW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByb3VuZFZlY3Rvcih2YWw6IFZlY3Rvciwgb3V0PzogVmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKCFvdXQpIG91dCA9IG5ldyBWZWN0b3IoKTtcclxuICAgICAgICBvdXQueCA9IFV0aWxpdGllcy5yb3VuZE51bWJlcih2YWwueCk7XHJcbiAgICAgICAgb3V0LnkgPSBVdGlsaXRpZXMucm91bmROdW1iZXIodmFsLnkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIENvbG9yc1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmFuZG9tQ29sb3IobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBtYXggLSBtaW47XHJcblxyXG4gICAgICAgIGNvbnN0IHIgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiByYW5nZSArIG1pbik7XHJcbiAgICAgICAgY29uc3QgZyA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIHJhbmdlICsgbWluKTtcclxuICAgICAgICBjb25zdCBiID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogcmFuZ2UgKyBtaW4pO1xyXG5cclxuICAgICAgICByZXR1cm4gYHJnYigke3J9LCR7Z30sJHtifSlgO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3Ige1xyXG5cclxuICAgIGdldCByKCkgeyByZXR1cm4gdGhpcy5fcjsgfVxyXG4gICAgc2V0IHIodmFsdWUpIHsgdGhpcy5fciA9IHZhbHVlOyB0aGlzLnVwZGF0ZUNzcygpOyB9XHJcblxyXG4gICAgZ2V0IGcoKSB7IHJldHVybiB0aGlzLl9nOyB9XHJcbiAgICBzZXQgZyh2YWx1ZSkgeyB0aGlzLl9nID0gdmFsdWU7IHRoaXMudXBkYXRlQ3NzKCk7IH1cclxuXHJcbiAgICBnZXQgYigpIHsgcmV0dXJuIHRoaXMuX2I7IH1cclxuICAgIHNldCBiKHZhbHVlKSB7IHRoaXMuX2IgPSB2YWx1ZTsgdGhpcy51cGRhdGVDc3MoKTsgfVxyXG5cclxuICAgIHByaXZhdGUgX2Nzczogc3RyaW5nID0gXCJyZ2IoMCwwLDApXCI7XHJcbiAgICBnZXQgY3NzKCkgeyByZXR1cm4gdGhpcy5fY3NzOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcjogbnVtYmVyID0gMCwgcHJpdmF0ZSBfZzogbnVtYmVyID0gMCwgcHJpdmF0ZSBfYjogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ3NzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KHI6IG51bWJlciA9IDAsIGc6IG51bWJlciA9IDAsIGI6IG51bWJlciA9IDApIHtcclxuICAgICAgICB0aGlzLl9yID0gcjtcclxuICAgICAgICB0aGlzLl9nID0gZztcclxuICAgICAgICB0aGlzLl9iID0gYjtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVDc3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUNzcygpIHtcclxuICAgICAgICB0aGlzLl9jc3MgPSBgcmdiKCR7dGhpcy5fcn0sJHt0aGlzLl9nfSwke3RoaXMuX2J9KWA7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IFZlY3RvciBmcm9tIFwiLi9WZWN0b3JcIjtcclxuaW1wb3J0IEFBQkIgZnJvbSBcIi4vQUFCQlwiO1xyXG5pbXBvcnQgQ29uc3RhbnRzIGZyb20gXCIuL0NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tIFwiLi9EaXJlY3Rpb25cIjtcclxuaW1wb3J0IElQb2ludCBmcm9tIFwiLi9JUG9pbnRcIjtcclxuaW1wb3J0IHsgTWFwLCBNYXBUaWxlVHlwZSB9IGZyb20gXCIuL01hcFwiO1xyXG5pbXBvcnQgeyBJbnB1dEFjdGlvblR5cGUgfSBmcm9tIFwiLi9JbnB1dEFjdGlvblR5cGVcIjtcclxuaW1wb3J0IFV0aWxpdGllcyBmcm9tIFwiLi9VdGlsaXRpZXNcIjtcclxuaW1wb3J0IEVuZ2luZSBmcm9tIFwiLi9FbmdpbmVcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuL0NvbG9yXCI7XHJcblxyXG5pbnRlcmZhY2UgSUdyb3VuZENoZWNrUmVzdWx0cyB7XHJcbiAgICBvbkdyb3VuZDogYm9vbGVhbjtcclxuICAgIG9uT25lV2F5UGxhdGZvcm06IGJvb2xlYW47XHJcbiAgICBncm91bmRZOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdmluZ09iamVjdCB7XHJcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBjb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoKTtcclxuICAgIHB1YmxpYyBsYXN0VXBkYXRlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZHJhd1Bvc2l0aW9uID0gVmVjdG9yLnplcm8uY2xvbmUoKTtcclxuICAgIHB1YmxpYyByZWFkeTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyB2ZWxvY2l0eSA9IFZlY3Rvci56ZXJvLmNsb25lKCk7XHJcbiAgICBwdWJsaWMgbWF4VmVsb2NpdHkgPSBuZXcgVmVjdG9yKENvbnN0YW50cy5kZWZhdWx0V2Fsa1NwZWVkLCBDb25zdGFudHMubWF4RmFsbFNwZWVkKTtcclxuICAgIHB1YmxpYyBqdW1wU3BlZWQgPSBDb25zdGFudHMuZGVmYXVsdEp1bXBTcGVlZDtcclxuICAgIHB1YmxpYyBhY2NlbCA9IENvbnN0YW50cy5kZWZhdWx0QWNjZWw7XHJcbiAgICBwdWJsaWMgZGVjZWwgPSBDb25zdGFudHMuZGVmYXVsdERlY2VsO1xyXG4gICAgcHVibGljIHNjYWxlID0gVmVjdG9yLm9uZS5jbG9uZSgpO1xyXG4gICAgcHVibGljIGFhYmJPZmZzZXQgPSBWZWN0b3IuemVyby5jbG9uZSgpO1xyXG4gICAgcHVibGljIGFhYmI6IEFBQkI7XHJcblxyXG4gICAgcHVibGljIG1vdmVSaWdodCA9IGZhbHNlO1xyXG4gICAgcHVibGljIG1vdmVMZWZ0ID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbW92ZURvd24gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBqdW1waW5nID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgcnVubmluZyA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBwdXNoZWRSaWdodFdhbGwgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBwdXNoZXNSaWdodFdhbGwgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBwdXNoZWRMZWZ0V2FsbCA9IGZhbHNlO1xyXG4gICAgcHVibGljIHB1c2hlc0xlZnRXYWxsID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgd2FzT25Hcm91bmQgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBvbkdyb3VuZCA9IGZhbHNlO1xyXG4gICAgcHVibGljIHdhc0F0Q2VpbGluZyA9IGZhbHNlO1xyXG4gICAgcHVibGljIGF0Q2VpbGluZyA9IGZhbHNlO1xyXG4gICAgcHVibGljIG9uT25lV2F5UGxhdGZvcm0gPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIG9sZFBvc2l0aW9uOiBWZWN0b3I7XHJcbiAgICBwcml2YXRlIG9sZFNwZWVkID0gVmVjdG9yLnplcm8uY2xvbmUoKTtcclxuXHJcbiAgICBwcml2YXRlIGdyb3VuZENoZWNrUmVzdWx0czogSUdyb3VuZENoZWNrUmVzdWx0cyA9IHtcclxuICAgICAgICBvbkdyb3VuZDogZmFsc2UsXHJcbiAgICAgICAgb25PbmVXYXlQbGF0Zm9ybTogZmFsc2UsXHJcbiAgICAgICAgZ3JvdW5kWTogMFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVuZ2luZTogRW5naW5lLCBwdWJsaWMgcG9zaXRpb246IFZlY3RvciwgYWFiYkhhbGZTaXplOiBWZWN0b3IpIHtcclxuICAgICAgICB0aGlzLm9sZFBvc2l0aW9uID0gVmVjdG9yLmNsb25lKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmFhYmIgPSBuZXcgQUFCQihWZWN0b3IuemVyby5jbG9uZSgpLCBWZWN0b3IuY2xvbmUoYWFiYkhhbGZTaXplKSk7XHJcbiAgICAgICAgVmVjdG9yLmFkZCh0aGlzLnBvc2l0aW9uLCB0aGlzLmFhYmJPZmZzZXQsIHRoaXMuYWFiYi5jZW50ZXIpO1xyXG4gICAgICAgIHRoaXMuZHJhd1Bvc2l0aW9uLmNvcHlGcm9tKHBvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMub2xkUG9zaXRpb24uY29weUZyb20odGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5vbGRTcGVlZC5jb3B5RnJvbSh0aGlzLnZlbG9jaXR5KTtcclxuXHJcbiAgICAgICAgdGhpcy53YXNPbkdyb3VuZCA9IHRoaXMub25Hcm91bmQ7XHJcbiAgICAgICAgdGhpcy5wdXNoZWRSaWdodFdhbGwgPSB0aGlzLnB1c2hlc1JpZ2h0V2FsbDtcclxuICAgICAgICB0aGlzLnB1c2hlZExlZnRXYWxsID0gdGhpcy5wdXNoZXNMZWZ0V2FsbDtcclxuICAgICAgICB0aGlzLndhc0F0Q2VpbGluZyA9IHRoaXMuYXRDZWlsaW5nO1xyXG5cclxuICAgICAgICBjb25zdCBtYXggPSB0aGlzLnJ1bm5pbmcgPyB0aGlzLm1heFZlbG9jaXR5LnggKiAxLjUgOiB0aGlzLm1heFZlbG9jaXR5Lng7XHJcbiAgICAgICAgbGV0IGFjY2VsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tb3ZlUmlnaHQgJiYgdGhpcy52ZWxvY2l0eS54IDwgbWF4KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZlbG9jaXR5LnggPCAwKSB7IGFjY2VsID0gdGhpcy5kZWNlbDsgfVxyXG4gICAgICAgICAgICBlbHNlIHsgYWNjZWwgPSB0aGlzLmFjY2VsOyB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggKz0gYWNjZWwgKiBlbGFwc2VkO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudmVsb2NpdHkueCA+IG1heCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS54ID0gbWF4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1vdmVMZWZ0ICYmIHRoaXMudmVsb2NpdHkueCA+IC1tYXgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmVsb2NpdHkueCA+IDApIHsgYWNjZWwgPSB0aGlzLmRlY2VsOyB9XHJcbiAgICAgICAgICAgIGVsc2UgeyBhY2NlbCA9IHRoaXMuYWNjZWw7IH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCAtPSBhY2NlbCAqIGVsYXBzZWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy52ZWxvY2l0eS54IDwgLW1heCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS54ID0gLW1heDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52ZWxvY2l0eS54ID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggLT0gdGhpcy5kZWNlbCAqIGVsYXBzZWQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZlbG9jaXR5LnggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZlbG9jaXR5LnggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCArPSB0aGlzLmRlY2VsICogZWxhcHNlZDtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmVsb2NpdHkueCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoaXMgZGlzYWJsZXMgYWNjZWxlcmF0aW9uXHJcbiAgICAgICAgLy9pZiAodGhpcy5tb3ZlUmlnaHQpXHJcbiAgICAgICAgLy8gICAgdGhpcy52ZWxvY2l0eS54ID0gdGhpcy5tYXhWZWxvY2l0eS54O1xyXG4gICAgICAgIC8vZWxzZSBpZiAodGhpcy5tb3ZlTGVmdClcclxuICAgICAgICAvLyAgICB0aGlzLnZlbG9jaXR5LnggPSAtdGhpcy5tYXhWZWxvY2l0eS54O1xyXG4gICAgICAgIC8vZWxzZVxyXG4gICAgICAgIC8vICAgIHRoaXMudmVsb2NpdHkueCA9IDA7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IExlc3MgYWdpbGl0eSBpbiB0aGUgYWlyLlxyXG5cclxuICAgICAgICBpZiAodGhpcy5qdW1waW5nICYmIHRoaXMub25Hcm91bmQpIHtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS55ID0gdGhpcy5qdW1wU3BlZWQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS55ICs9IENvbnN0YW50cy5ncmF2aXR5ICogZWxhcHNlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuanVtcGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZChWZWN0b3IubXVsdGlwbHkodGhpcy52ZWxvY2l0eSwgZWxhcHNlZCkpO1xyXG5cclxuICAgICAgICBjb25zdCBvbGRDZW50ZXIgPSBWZWN0b3IuYWRkKHRoaXMub2xkUG9zaXRpb24sIHRoaXMuYWFiYk9mZnNldCk7XHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gVmVjdG9yLmFkZCh0aGlzLnBvc2l0aW9uLCB0aGlzLmFhYmJPZmZzZXQpO1xyXG5cclxuICAgICAgICBsZXQgcmlnaHRXYWxsWDogbnVtYmVyID0gdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsZWZ0V2FsbFg6IG51bWJlciA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmVsb2NpdHkueCA8PSAwKSB7XHJcbiAgICAgICAgICAgIGxlZnRXYWxsWCA9IHRoaXMuY2hlY2tMZWZ0KG9sZENlbnRlciwgY2VudGVyKTtcclxuICAgICAgICAgICAgaWYgKGxlZnRXYWxsWCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9sZFBvc2l0aW9uLnggLSB0aGlzLmFhYmIuaGFsZlNpemUueCArIHRoaXMuYWFiYk9mZnNldC54ID49IGxlZnRXYWxsWCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9IGxlZnRXYWxsWCArIHRoaXMuYWFiYi5oYWxmU2l6ZS54IC0gdGhpcy5hYWJiT2Zmc2V0Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoZXNMZWZ0V2FsbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS54ID0gTWF0aC5tYXgodGhpcy52ZWxvY2l0eS54LCAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaGVzTGVmdFdhbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaGVzTGVmdFdhbGwgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZlbG9jaXR5LnggPj0gMCkge1xyXG4gICAgICAgICAgICByaWdodFdhbGxYID0gdGhpcy5jaGVja1JpZ2h0KG9sZENlbnRlciwgY2VudGVyKTtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0V2FsbFggIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbGRQb3NpdGlvbi54ICsgdGhpcy5hYWJiLmhhbGZTaXplLnggKyB0aGlzLmFhYmJPZmZzZXQueCA8PSByaWdodFdhbGxYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gcmlnaHRXYWxsWCAtIHRoaXMuYWFiYi5oYWxmU2l6ZS54IC0gdGhpcy5hYWJiT2Zmc2V0Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoZXNSaWdodFdhbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCA9IE1hdGgubWluKHRoaXMudmVsb2NpdHkueCwgMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hlc1JpZ2h0V2FsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoZXNSaWdodFdhbGwgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZlbG9jaXR5LnkgPj0gMCAmJiB0aGlzLmNoZWNrR3JvdW5kKG9sZENlbnRlciwgY2VudGVyLCB0aGlzLmdyb3VuZENoZWNrUmVzdWx0cykpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdGhpcy5ncm91bmRDaGVja1Jlc3VsdHMuZ3JvdW5kWSAtIHRoaXMuYWFiYi5oYWxmU2l6ZS55IC0gdGhpcy5hYWJiT2Zmc2V0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMub25PbmVXYXlQbGF0Zm9ybSA9IHRoaXMuZ3JvdW5kQ2hlY2tSZXN1bHRzLm9uT25lV2F5UGxhdGZvcm07XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMub25Hcm91bmQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Hcm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbk9uZVdheVBsYXRmb3JtID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmF0Q2VpbGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLnZlbG9jaXR5LnkgPD0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBjZWlsaW5nWSA9IHRoaXMuY2hlY2tDZWlsaW5nKG9sZENlbnRlciwgY2VudGVyKTtcclxuICAgICAgICAgICAgaWYgKGNlaWxpbmdZICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXRDZWlsaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9IGNlaWxpbmdZICsgdGhpcy5hYWJiLmhhbGZTaXplLnkgLSB0aGlzLmFhYmJPZmZzZXQueSArIDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5tb3ZlRG93biAmJiB0aGlzLm9uT25lV2F5UGxhdGZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IENvbnN0YW50cy5vbmVXYXlQbGF0Zm9ybVRocmVzaG9sZCArIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlRG93biA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUm91bmQgZmxvYXRpbmcgcG9pbnQgdmFsdWVzIHRvIGhlbHAgd2l0aCBuZXR3b3JrIHJlY29uY2lsaWF0aW9uLlxyXG4gICAgICAgIFV0aWxpdGllcy5yb3VuZFZlY3Rvcih0aGlzLnZlbG9jaXR5LCB0aGlzLnZlbG9jaXR5KTtcclxuICAgICAgICBVdGlsaXRpZXMucm91bmRWZWN0b3IodGhpcy5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgIFZlY3Rvci5hZGQodGhpcy5wb3NpdGlvbiwgdGhpcy5hYWJiT2Zmc2V0LCB0aGlzLmFhYmIuY2VudGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrR3JvdW5kKG9sZENlbnRlcjogVmVjdG9yLCBjZW50ZXI6IFZlY3RvciwgZ3JvdW5kQ2hlY2tSZXN1bHRzOiBJR3JvdW5kQ2hlY2tSZXN1bHRzKSB7XHJcbiAgICAgICAgZ3JvdW5kQ2hlY2tSZXN1bHRzLm9uT25lV2F5UGxhdGZvcm0gPSBmYWxzZTtcclxuICAgICAgICBncm91bmRDaGVja1Jlc3VsdHMub25Hcm91bmQgPSBmYWxzZTtcclxuICAgICAgICBncm91bmRDaGVja1Jlc3VsdHMuZ3JvdW5kWSA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZEJvdHRvbUxlZnQgPSBuZXcgVmVjdG9yKFxyXG4gICAgICAgICAgICBvbGRDZW50ZXIueCAtIHRoaXMuYWFiYi5oYWxmU2l6ZS54ICsgVmVjdG9yLnJpZ2h0LngsXHJcbiAgICAgICAgICAgIG9sZENlbnRlci55ICsgdGhpcy5hYWJiLmhhbGZTaXplLnkgKyBWZWN0b3IuZG93bi55XHJcbiAgICAgICAgKS5yb3VuZCgpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdCb3R0b21MZWZ0ID0gbmV3IFZlY3RvcihcclxuICAgICAgICAgICAgY2VudGVyLnggLSB0aGlzLmFhYmIuaGFsZlNpemUueCArIFZlY3Rvci5yaWdodC54LFxyXG4gICAgICAgICAgICBjZW50ZXIueSArIHRoaXMuYWFiYi5oYWxmU2l6ZS55ICsgVmVjdG9yLmRvd24ueVxyXG4gICAgICAgICkucm91bmQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZW5kWSA9IHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWUF0UG9pbnQobmV3Qm90dG9tTGVmdC55KTtcclxuICAgICAgICBjb25zdCBiZWdZID0gTWF0aC5taW4odGhpcy5lbmdpbmUubWFwLmdldE1hcFRpbGVZQXRQb2ludChvbGRCb3R0b21MZWZ0LnkpICsgMSwgZW5kWSk7XHJcbiAgICAgICAgY29uc3QgZGlzdCA9IE1hdGgubWF4KE1hdGguYWJzKGVuZFkgLSBiZWdZKSwgMSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNoZWNrZWRUaWxlOiBWZWN0b3IgPSBuZXcgVmVjdG9yKCksXHJcbiAgICAgICAgICAgIGJvdHRvbUxlZnQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoKSxcclxuICAgICAgICAgICAgYm90dG9tUmlnaHQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVJbmRleFg6IG51bWJlcixcclxuICAgICAgICAgICAgdGlsZTogTWFwVGlsZVR5cGU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHRpbGVJbmRleFkgPSBiZWdZOyB0aWxlSW5kZXhZIDw9IGVuZFk7IHRpbGVJbmRleFkrKykge1xyXG4gICAgICAgICAgICBWZWN0b3IubGVycChvbGRCb3R0b21MZWZ0LCBuZXdCb3R0b21MZWZ0LCBNYXRoLmFicyhlbmRZIC0gdGlsZUluZGV4WSkgLyBkaXN0LCBib3R0b21MZWZ0KTtcclxuICAgICAgICAgICAgYm90dG9tUmlnaHQueCA9IGJvdHRvbUxlZnQueCArIHRoaXMuYWFiYi5oYWxmU2l6ZS54ICogMiAtIDI7XHJcbiAgICAgICAgICAgIGJvdHRvbVJpZ2h0LnkgPSBib3R0b21MZWZ0Lnk7XHJcblxyXG4gICAgICAgICAgICBjaGVja2VkVGlsZS5jb3B5RnJvbShib3R0b21MZWZ0KTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja2VkVGlsZS54ID0gTWF0aC5taW4oY2hlY2tlZFRpbGUueCwgYm90dG9tUmlnaHQueCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGlsZUluZGV4WCA9IHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWEF0UG9pbnQoY2hlY2tlZFRpbGUueCk7XHJcbiAgICAgICAgICAgICAgICB0aWxlID0gdGhpcy5lbmdpbmUubWFwLmdldFRpbGUodGlsZUluZGV4WCwgdGlsZUluZGV4WSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZ3JvdW5kQ2hlY2tSZXN1bHRzLmdyb3VuZFkgPSB0aWxlSW5kZXhZICogQ29uc3RhbnRzLnRpbGVTaXplIC0gQ29uc3RhbnRzLnRpbGVTaXplIC8gMiArIHRoaXMuZW5naW5lLm1hcC5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aWxlID09PSBNYXBUaWxlVHlwZS5CbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VuZENoZWNrUmVzdWx0cy5vbkdyb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdW5kQ2hlY2tSZXN1bHRzLm9uT25lV2F5UGxhdGZvcm0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGlsZSA9PT0gTWFwVGlsZVR5cGUuT25lV2F5XHJcbiAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2hlY2tlZFRpbGUueSAtIGdyb3VuZENoZWNrUmVzdWx0cy5ncm91bmRZKSA8PSBDb25zdGFudHMub25lV2F5UGxhdGZvcm1UaHJlc2hvbGQgKyAodGhpcy5wb3NpdGlvbi55IC0gdGhpcy5vbGRQb3NpdGlvbi55KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VuZENoZWNrUmVzdWx0cy5vbk9uZVdheVBsYXRmb3JtID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZFRpbGUueCA+PSBib3R0b21SaWdodC54KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VuZENoZWNrUmVzdWx0cy5vbk9uZVdheVBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFRpbGUueCArPSBDb25zdGFudHMudGlsZVNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrQ2VpbGluZyhvbGRDZW50ZXI6IFZlY3RvciwgY2VudGVyOiBWZWN0b3IpIHtcclxuICAgICAgICBjb25zdCBvbGRUb3BSaWdodCA9IG5ldyBWZWN0b3IoXHJcbiAgICAgICAgICAgIG9sZENlbnRlci54ICsgdGhpcy5hYWJiLmhhbGZTaXplLnggLSBWZWN0b3IucmlnaHQueCxcclxuICAgICAgICAgICAgb2xkQ2VudGVyLnkgLSB0aGlzLmFhYmIuaGFsZlNpemUueSArIFZlY3Rvci51cC55XHJcbiAgICAgICAgKS5yb3VuZCgpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdUb3BSaWdodCA9IG5ldyBWZWN0b3IoXHJcbiAgICAgICAgICAgIGNlbnRlci54ICsgdGhpcy5hYWJiLmhhbGZTaXplLnggLSBWZWN0b3IucmlnaHQueCxcclxuICAgICAgICAgICAgY2VudGVyLnkgLSB0aGlzLmFhYmIuaGFsZlNpemUueSArIFZlY3Rvci51cC55XHJcbiAgICAgICAgKS5yb3VuZCgpO1xyXG5cclxuICAgICAgICBjb25zdCBlbmRZID0gdGhpcy5lbmdpbmUubWFwLmdldE1hcFRpbGVZQXRQb2ludChuZXdUb3BSaWdodC55KTtcclxuICAgICAgICBjb25zdCBiZWdZID0gTWF0aC5tYXgodGhpcy5lbmdpbmUubWFwLmdldE1hcFRpbGVZQXRQb2ludChvbGRUb3BSaWdodC55KSAtIDEsIGVuZFkpO1xyXG4gICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLm1heChNYXRoLmFicyhlbmRZIC0gYmVnWSksIDEpO1xyXG5cclxuICAgICAgICBjb25zdCBjaGVja2VkVGlsZTogVmVjdG9yID0gbmV3IFZlY3RvcigpLFxyXG4gICAgICAgICAgICB0b3BMZWZ0OiBWZWN0b3IgPSBuZXcgVmVjdG9yKCksXHJcbiAgICAgICAgICAgIHRvcFJpZ2h0OiBWZWN0b3IgPSBuZXcgVmVjdG9yKCk7XHJcblxyXG4gICAgICAgIGxldCB0aWxlSW5kZXhYOiBudW1iZXIsXHJcbiAgICAgICAgICAgIHRpbGU6IE1hcFRpbGVUeXBlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCB0aWxlSW5kZXhZID0gYmVnWTsgdGlsZUluZGV4WSA+PSBlbmRZOyB0aWxlSW5kZXhZLS0pIHtcclxuICAgICAgICAgICAgVmVjdG9yLmxlcnAob2xkVG9wUmlnaHQsIG5ld1RvcFJpZ2h0LCBNYXRoLmFicyhlbmRZIC0gdGlsZUluZGV4WSkgLyBkaXN0LCB0b3BSaWdodCk7XHJcbiAgICAgICAgICAgIHRvcExlZnQueCA9IHRvcFJpZ2h0LnggLSB0aGlzLmFhYmIuaGFsZlNpemUueCAqIDIgKyAyO1xyXG4gICAgICAgICAgICB0b3BMZWZ0LnkgPSB0b3BSaWdodC55O1xyXG5cclxuICAgICAgICAgICAgY2hlY2tlZFRpbGUuY29weUZyb20odG9wTGVmdCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFRpbGUueCA9IE1hdGgubWluKGNoZWNrZWRUaWxlLngsIHRvcFJpZ2h0LngpO1xyXG4gICAgICAgICAgICAgICAgdGlsZUluZGV4WCA9IHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWEF0UG9pbnQoY2hlY2tlZFRpbGUueCk7XHJcbiAgICAgICAgICAgICAgICB0aWxlID0gdGhpcy5lbmdpbmUubWFwLmdldFRpbGUodGlsZUluZGV4WCwgdGlsZUluZGV4WSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUgPT09IE1hcFRpbGVUeXBlLkJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGVJbmRleFkgKiBDb25zdGFudHMudGlsZVNpemUgKyBDb25zdGFudHMudGlsZVNpemUgLyAyICsgdGhpcy5lbmdpbmUubWFwLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWRUaWxlLnggPj0gdG9wUmlnaHQueCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNoZWNrZWRUaWxlLnggKz0gQ29uc3RhbnRzLnRpbGVTaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tMZWZ0KG9sZENlbnRlcjogVmVjdG9yLCBjZW50ZXI6IFZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IG9sZEJvdHRvbUxlZnQgPSBuZXcgVmVjdG9yKFxyXG4gICAgICAgICAgICBvbGRDZW50ZXIueCAtIHRoaXMuYWFiYi5oYWxmU2l6ZS54IC0gMSxcclxuICAgICAgICAgICAgb2xkQ2VudGVyLnkgKyB0aGlzLmFhYmIuaGFsZlNpemUueSAtIDFcclxuICAgICAgICApLnJvdW5kKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0JvdHRvbUxlZnQgPSBuZXcgVmVjdG9yKFxyXG4gICAgICAgICAgICBjZW50ZXIueCAtIHRoaXMuYWFiYi5oYWxmU2l6ZS54IC0gMSxcclxuICAgICAgICAgICAgY2VudGVyLnkgKyB0aGlzLmFhYmIuaGFsZlNpemUueSAtIDFcclxuICAgICAgICApLnJvdW5kKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVuZFggPSB0aGlzLmVuZ2luZS5tYXAuZ2V0TWFwVGlsZVhBdFBvaW50KG5ld0JvdHRvbUxlZnQueCk7XHJcbiAgICAgICAgY29uc3QgYmVnWCA9IE1hdGgubWF4KHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWEF0UG9pbnQob2xkQm90dG9tTGVmdC54KSAtIDEsIGVuZFgpO1xyXG4gICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLm1heChNYXRoLmFicyhlbmRYIC0gYmVnWCksIDEpO1xyXG5cclxuICAgICAgICBjb25zdCBjaGVja2VkVGlsZTogVmVjdG9yID0gbmV3IFZlY3RvcigpLFxyXG4gICAgICAgICAgICBib3R0b21MZWZ0OiBWZWN0b3IgPSBuZXcgVmVjdG9yKCksXHJcbiAgICAgICAgICAgIHRvcExlZnQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVJbmRleFk6IG51bWJlcixcclxuICAgICAgICAgICAgdGlsZTogTWFwVGlsZVR5cGU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHRpbGVJbmRleFggPSBiZWdYOyB0aWxlSW5kZXhYID49IGVuZFg7IHRpbGVJbmRleFgtLSkge1xyXG4gICAgICAgICAgICBWZWN0b3IubGVycChvbGRCb3R0b21MZWZ0LCBuZXdCb3R0b21MZWZ0LCBNYXRoLmFicyhlbmRYIC0gdGlsZUluZGV4WCkgLyBkaXN0LCBib3R0b21MZWZ0KTtcclxuICAgICAgICAgICAgdG9wTGVmdC54ID0gYm90dG9tTGVmdC54O1xyXG4gICAgICAgICAgICB0b3BMZWZ0LnkgPSBib3R0b21MZWZ0LnkgLSB0aGlzLmFhYmIuaGFsZlNpemUueSAqIDIgKyAyO1xyXG5cclxuICAgICAgICAgICAgY2hlY2tlZFRpbGUuY29weUZyb20oYm90dG9tTGVmdCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFRpbGUueSA9IE1hdGgubWF4KGNoZWNrZWRUaWxlLnksIHRvcExlZnQueSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGlsZUluZGV4WSA9IHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWUF0UG9pbnQoY2hlY2tlZFRpbGUueSk7XHJcbiAgICAgICAgICAgICAgICB0aWxlID0gdGhpcy5lbmdpbmUubWFwLmdldFRpbGUodGlsZUluZGV4WCwgdGlsZUluZGV4WSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUgPT09IE1hcFRpbGVUeXBlLkJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGVJbmRleFggKiBDb25zdGFudHMudGlsZVNpemUgKyBDb25zdGFudHMudGlsZVNpemUgLyAyICsgdGhpcy5lbmdpbmUubWFwLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFRpbGUueSAtPSBDb25zdGFudHMudGlsZVNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWRUaWxlLnkgPD0gdG9wTGVmdC55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja1JpZ2h0KG9sZENlbnRlcjogVmVjdG9yLCBjZW50ZXI6IFZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IG9sZEJvdHRvbVJpZ2h0ID0gbmV3IFZlY3RvcihcclxuICAgICAgICAgICAgb2xkQ2VudGVyLnggKyB0aGlzLmFhYmIuaGFsZlNpemUueCArIDEsXHJcbiAgICAgICAgICAgIG9sZENlbnRlci55ICsgdGhpcy5hYWJiLmhhbGZTaXplLnkgLSAxXHJcbiAgICAgICAgKS5yb3VuZCgpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdCb3R0b21SaWdodCA9IG5ldyBWZWN0b3IoXHJcbiAgICAgICAgICAgIGNlbnRlci54ICsgdGhpcy5hYWJiLmhhbGZTaXplLnggKyAxLFxyXG4gICAgICAgICAgICBjZW50ZXIueSArIHRoaXMuYWFiYi5oYWxmU2l6ZS55IC0gMVxyXG4gICAgICAgICkucm91bmQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZW5kWCA9IHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWEF0UG9pbnQobmV3Qm90dG9tUmlnaHQueCk7XHJcbiAgICAgICAgY29uc3QgYmVnWCA9IE1hdGgubWluKHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWEF0UG9pbnQob2xkQm90dG9tUmlnaHQueCkgKyAxLCBlbmRYKTtcclxuICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5tYXgoTWF0aC5hYnMoZW5kWCAtIGJlZ1gpLCAxKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2hlY2tlZFRpbGU6IFZlY3RvciA9IG5ldyBWZWN0b3IoKSxcclxuICAgICAgICAgICAgYm90dG9tUmlnaHQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoKSxcclxuICAgICAgICAgICAgdG9wUmlnaHQ6IFZlY3RvciA9IG5ldyBWZWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVJbmRleFk6IG51bWJlcixcclxuICAgICAgICAgICAgdGlsZTogTWFwVGlsZVR5cGU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHRpbGVJbmRleFggPSBiZWdYOyB0aWxlSW5kZXhYIDw9IGVuZFg7IHRpbGVJbmRleFgrKykge1xyXG4gICAgICAgICAgICBWZWN0b3IubGVycChvbGRCb3R0b21SaWdodCwgbmV3Qm90dG9tUmlnaHQsIE1hdGguYWJzKGVuZFggLSB0aWxlSW5kZXhYKSAvIGRpc3QsIGJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgdG9wUmlnaHQueCA9IGJvdHRvbVJpZ2h0Lng7XHJcbiAgICAgICAgICAgIHRvcFJpZ2h0LnkgPSBib3R0b21SaWdodC55IC0gdGhpcy5hYWJiLmhhbGZTaXplLnkgKiAyICsgMjtcclxuXHJcbiAgICAgICAgICAgIGNoZWNrZWRUaWxlLmNvcHlGcm9tKGJvdHRvbVJpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja2VkVGlsZS55ID0gTWF0aC5tYXgoY2hlY2tlZFRpbGUueSwgdG9wUmlnaHQueSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGlsZUluZGV4WSA9IHRoaXMuZW5naW5lLm1hcC5nZXRNYXBUaWxlWUF0UG9pbnQoY2hlY2tlZFRpbGUueSk7XHJcbiAgICAgICAgICAgICAgICB0aWxlID0gdGhpcy5lbmdpbmUubWFwLmdldFRpbGUodGlsZUluZGV4WCwgdGlsZUluZGV4WSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUgPT09IE1hcFRpbGVUeXBlLkJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGVJbmRleFggKiBDb25zdGFudHMudGlsZVNpemUgLSBDb25zdGFudHMudGlsZVNpemUgLyAyICsgdGhpcy5lbmdpbmUubWFwLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFRpbGUueSAtPSBDb25zdGFudHMudGlsZVNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWRUaWxlLnkgPD0gdG9wUmlnaHQueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IGVudW0gRW50aXR5U3RhdGUge1xyXG4gICAgSWRsZSxcclxuICAgIFdhbGtpbmcsXHJcbiAgICBKdW1waW5nLFxyXG4gICAgRmFsbGluZyxcclxuICAgIExhbmRpbmdcclxufSIsImltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XHJcbmltcG9ydCBNb3ZpbmdPYmplY3QgZnJvbSBcIi4vTW92aW5nT2JqZWN0XCI7XHJcbmltcG9ydCB7IEVudGl0eVN0YXRlIH0gZnJvbSBcIi4vRW50aXR5U3RhdGVcIjtcclxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4vTWFwXCI7XHJcbmltcG9ydCB7IElucHV0QWN0aW9uVHlwZSB9IGZyb20gXCIuL0lucHV0QWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgRW5naW5lIGZyb20gXCIuL0VuZ2luZVwiO1xyXG5pbXBvcnQgVXRpbGl0aWVzIGZyb20gXCIuL1V0aWxpdGllc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IGV4dGVuZHMgTW92aW5nT2JqZWN0IHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWluU3BlZWQ6IG51bWJlciA9IDAuMDAxO1xyXG5cclxuICAgIHB1YmxpYyBlbnRpdHlTdGF0ZTogRW50aXR5U3RhdGUgPSBFbnRpdHlTdGF0ZS5JZGxlO1xyXG5cclxuICAgIHByaXZhdGUgdGFyZ2V0U2NhbGU6IFZlY3RvciA9IFZlY3Rvci5vbmUuY2xvbmUoKTtcclxuICAgIHByaXZhdGUgc2NhbGVWZWxvY2l0eTogbnVtYmVyID0gMTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbmdpbmU6IEVuZ2luZSwgcG9zaXRpb246IFZlY3RvciwgYWFiYkhhbGZTaXplOiBWZWN0b3IpIHtcclxuICAgICAgICBzdXBlcihlbmdpbmUsIHBvc2l0aW9uLCBhYWJiSGFsZlNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZWxhcHNlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGVsYXBzZWQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50YXJnZXRTY2FsZS54ID4gdGhpcy5zY2FsZS54KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGUueCArPSB0aGlzLnNjYWxlVmVsb2NpdHkgKiBlbGFwc2VkO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zY2FsZS54ID4gdGhpcy50YXJnZXRTY2FsZS54KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnggPSB0aGlzLnRhcmdldFNjYWxlLng7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZlbG9jaXR5Lmxlbmd0aFNxdWFyZWQoKSA8IHRoaXMuTWluU3BlZWQpIHtcclxuICAgICAgICAgICAgLy8gTm90IG1vdmluZyBhdCBhbGxcclxuICAgICAgICAgICAgdGhpcy5lbnRpdHlTdGF0ZSA9IEVudGl0eVN0YXRlLklkbGU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy53YXNPbkdyb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSnVzdCBsYW5kZWQgb24gdGhlIGdyb3VuZC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52ZWxvY2l0eS55IDwgLXRoaXMuTWluU3BlZWQpIHtcclxuICAgICAgICAgICAgLy8gTW92aW5nIHVwXHJcbiAgICAgICAgICAgIHRoaXMuZW50aXR5U3RhdGUgPSBFbnRpdHlTdGF0ZS5KdW1waW5nO1xyXG4gICAgICAgICAgICBpZiAodGhpcy53YXNPbkdyb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSnVzdCBzdGFydGVkIGp1bXBpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52ZWxvY2l0eS55ID4gdGhpcy5NaW5TcGVlZCkge1xyXG4gICAgICAgICAgICAvLyBNb3ZpbmcgZG93blxyXG4gICAgICAgICAgICB0aGlzLmVudGl0eVN0YXRlID0gRW50aXR5U3RhdGUuRmFsbGluZztcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmVsb2NpdHkueCA8IC10aGlzLk1pblNwZWVkKSB7XHJcbiAgICAgICAgICAgIC8vIFdhbGtpbmcgbGVmdC5cclxuICAgICAgICAgICAgdGhpcy5lbnRpdHlTdGF0ZSA9IEVudGl0eVN0YXRlLldhbGtpbmc7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZlbG9jaXR5LnggPiB0aGlzLk1pblNwZWVkKSB7XHJcbiAgICAgICAgICAgIC8vIFdhbGtpbmcgcmlnaHQuXHJcbiAgICAgICAgICAgIHRoaXMuZW50aXR5U3RhdGUgPSBFbnRpdHlTdGF0ZS5XYWxraW5nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBjb25zdCBlbnVtIE1lc3NhZ2VUeXBlIHtcclxuICAgIEpvaW5SZXF1ZXN0ID0gMSxcclxuICAgIEpvaW5BY2NlcHRlZCA9IDIsXHJcbiAgICBOZXdQbGF5ZXJKb2luZWQgPSAzLFxyXG4gICAgUGxheWVySW5wdXQgPSA0LFxyXG4gICAgUGxheWVyU3RhdGUgPSA1LFxyXG4gICAgUG9zaXRpb24gPSA2LFxyXG4gICAgUGxheWVyRGlzY29ubmVjdGVkID0gNyxcclxuICAgIFBpbmcgPSA4LFxyXG4gICAgU3RhdGVVcGRhdGUgPSA5LFxyXG4gICAgUGxheWVySW5mb1JlcXVlc3QgPSAxMCxcclxuICAgIFBsYXllckluZm8gPSAxMVxyXG59IiwiaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwiLi9NZXNzYWdlVHlwZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIElNZXNzYWdlIHtcclxuICAgIG1lc3NhZ2VUeXBlOiBNZXNzYWdlVHlwZTtcclxuXHJcbiAgICBtaW5pbXVtRGF0YUxlbmd0aDogbnVtYmVyO1xyXG4gICAgZnJvbUJ5dGVzOiAoZGF0YTogRGF0YVZpZXcsIGxpdHRsZUVuZGlhbjogYm9vbGVhbikgPT4gdm9pZDtcclxuICAgIHRvQnl0ZXM6IChsaXR0bGVFbmRpYW46IGJvb2xlYW4pID0+IEFycmF5QnVmZmVyO1xyXG59IiwiaW1wb3J0IElNZXNzYWdlIGZyb20gXCIuL0lNZXNzYWdlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vTWVzc2FnZVR5cGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpbmdNZXNzYWdlIGltcGxlbWVudHMgSU1lc3NhZ2Uge1xyXG4gICAgbWVzc2FnZVR5cGUgPSBNZXNzYWdlVHlwZS5QaW5nO1xyXG4gICAgbWluaW11bURhdGFMZW5ndGggPSA5O1xyXG5cclxuICAgIHBpbmdJRDogbnVtYmVyO1xyXG4gICAgYXZnRnJhbWVUaW1lOiBudW1iZXI7XHJcblxyXG4gICAgZnJvbUJ5dGVzKGRhdGE6IERhdGFWaWV3LCBsaXR0bGVFbmRpYW46IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLnBpbmdJRCA9IGRhdGEuZ2V0SW50MzIoMSwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB0aGlzLmF2Z0ZyYW1lVGltZSA9IGRhdGEuZ2V0RmxvYXQzMig1LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHRvQnl0ZXMobGl0dGxlRW5kaWFuOiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMubWluaW11bURhdGFMZW5ndGgpO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcclxuXHJcbiAgICAgICAgdmlldy5zZXRVaW50OCgwLCB0aGlzLm1lc3NhZ2VUeXBlKTtcclxuICAgICAgICB2aWV3LnNldEludDMyKDEsIHRoaXMucGluZ0lELCBsaXR0bGVFbmRpYW4pO1xyXG5cclxuICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IGVudW0gUmVqZWN0UmVhc29uIHtcclxuICAgIFVua25vd24gPSAwLFxyXG4gICAgVG9vTWFueVBsYXllcnMgPSAxLFxyXG4gICAgTmFtZUluVXNlID0gMixcclxuICAgIEJhbm5lZCA9IDNcclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE5ldHdvcmtIZWxwZXIge1xyXG5cclxuICAgIC8vIEFycmF5QnVmZmVyIHRvIFN0cmluZyAoVW5pY29kZSBVVEYtMTYpXHJcbiAgICBzdGF0aWMgQXJyYXlCdWZmZXJUb1N0cmluZyhidWZmZXI6IEFycmF5QnVmZmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkodW5kZWZpbmVkLCBuZXcgVWludDE2QXJyYXkoYnVmZmVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RyaW5nIHRvIEFycmF5QnVmZmVyIChVbmljb2RlIFVURi0xNilcclxuICAgIHN0YXRpYyBTdHJpbmdUb0FycmF5QnVmZmVyKHN0cjogc3RyaW5nLCBidWZmZXI6IEFycmF5QnVmZmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDE2QXJyYXkoYnVmZmVyLCBvZmZzZXQpO1xyXG4gICAgICAgIGNvbnN0IHN0ckxlbiA9IHN0ci5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyTGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBJTWVzc2FnZSBmcm9tIFwiLi9JTWVzc2FnZVwiO1xyXG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCIuL01lc3NhZ2VUeXBlXCI7XHJcbmltcG9ydCB7IFJlamVjdFJlYXNvbiB9IGZyb20gXCIuL1JlamVjdFJlYXNvblwiO1xyXG5pbXBvcnQgTmV0d29ya0hlbHBlciBmcm9tIFwiLi4vTmV0d29ya0hlbHBlclwiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uL0NvbG9yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKb2luQWNjZXB0ZWRNZXNzYWdlIGltcGxlbWVudHMgSU1lc3NhZ2Uge1xyXG4gICAgbWVzc2FnZVR5cGUgPSBNZXNzYWdlVHlwZS5Kb2luQWNjZXB0ZWQ7XHJcbiAgICBtaW5pbXVtRGF0YUxlbmd0aCA9IDIwO1xyXG5cclxuICAgIGFjY2VwdGVkOiBib29sZWFuO1xyXG4gICAgcmVqZWN0UmVhc29uOiBSZWplY3RSZWFzb247XHJcbiAgICBpc0xpdHRsZUVuZGlhbjogYm9vbGVhbjtcclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBtYXBJRDogbnVtYmVyO1xyXG4gICAgY29sb3I6IENvbG9yO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIGZyb21CeXRlcyhkYXRhOiBEYXRhVmlldywgbGl0dGxlRW5kaWFuOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5hY2NlcHRlZCA9IGRhdGEuZ2V0VWludDgoMSkgPT09IDE7XHJcbiAgICAgICAgdGhpcy5yZWplY3RSZWFzb24gPSBkYXRhLmdldFVpbnQ4KDIpIGFzIFJlamVjdFJlYXNvbjtcclxuICAgICAgICB0aGlzLmlzTGl0dGxlRW5kaWFuID0gZGF0YS5nZXRVaW50OCgzKSA9PT0gMTtcclxuICAgICAgICB0aGlzLmlkID0gZGF0YS5nZXRVaW50OCg0KTtcclxuICAgICAgICB0aGlzLm1hcElEID0gZGF0YS5nZXRJbnQzMig1LCB0aGlzLmlzTGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG5ldyBDb2xvcihkYXRhLmdldFVpbnQ4KDkpLCBkYXRhLmdldFVpbnQ4KDEwKSwgZGF0YS5nZXRVaW50OCgxMSkpO1xyXG5cclxuICAgICAgICBjb25zdCBsZW5ndGggPSBkYXRhLmdldFVpbnQ4KDEyKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihsZW5ndGgpO1xyXG4gICAgICAgIGNvbnN0IG5hbWVWaWV3ID0gbmV3IERhdGFWaWV3KG5hbWVCdWZmZXIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZUJ1ZmZlci5ieXRlTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbmFtZVZpZXcuc2V0VWludDgoaSwgZGF0YS5nZXRVaW50OCgxMyArIGkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5uYW1lID0gTmV0d29ya0hlbHBlci5BcnJheUJ1ZmZlclRvU3RyaW5nKG5hbWVCdWZmZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE5vdCB1c2VkIG9uIGNsaWVudFxyXG4gICAgdG9CeXRlcyhsaXR0bGVFbmRpYW46IGJvb2xlYW4pIHsgcmV0dXJuIG5ldyBBcnJheUJ1ZmZlcigwKTsgfVxyXG59IiwiaW1wb3J0IElNZXNzYWdlIGZyb20gXCIuL0lNZXNzYWdlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vTWVzc2FnZVR5cGVcIjtcclxuaW1wb3J0IE5ldHdvcmtIZWxwZXIgZnJvbSBcIi4uL05ldHdvcmtIZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpvaW5SZXF1ZXN0TWVzc2FnZSBpbXBsZW1lbnRzIElNZXNzYWdlIHtcclxuICAgIG1lc3NhZ2VUeXBlID0gTWVzc2FnZVR5cGUuSm9pblJlcXVlc3Q7XHJcbiAgICBtaW5pbXVtRGF0YUxlbmd0aCA9IDM7XHJcblxyXG4gICAgZ2V0IG1heE5hbWVMZW5ndGgoKSB7IHJldHVybiAyNTsgfVxyXG5cclxuICAgIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvLyBOb3QgdXNlZCBvbiBjbGllbnRcclxuICAgIGZyb21CeXRlcyhkYXRhOiBEYXRhVmlldywgbGl0dGxlRW5kaWFuOiBib29sZWFuKSB7IH1cclxuXHJcbiAgICB0b0J5dGVzKGxpdHRsZUVuZGlhbjogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID4gdGhpcy5tYXhOYW1lTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IHRoaXMubmFtZS5zdWJzdHIoMCwgdGhpcy5tYXhOYW1lTGVuZ3RoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLm5hbWUubGVuZ3RoICogMiArIDIpO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcclxuXHJcbiAgICAgICAgdmlldy5zZXRVaW50OCgwLCB0aGlzLm1lc3NhZ2VUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gTmFtZSBsZW5ndGhcclxuICAgICAgICB2aWV3LnNldFVpbnQ4KDEsIHRoaXMubmFtZS5sZW5ndGggKiAyKTsgLy8gMiBieXRlcyBwZXIgY2hhcmFjdGVyLlxyXG5cclxuICAgICAgICBOZXR3b3JrSGVscGVyLlN0cmluZ1RvQXJyYXlCdWZmZXIodGhpcy5uYW1lLCBidWZmZXIsIDIpO1xyXG5cclxuICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IElNZXNzYWdlIGZyb20gXCIuL0lNZXNzYWdlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vTWVzc2FnZVR5cGVcIjtcclxuaW1wb3J0IHsgSW5wdXRBY3Rpb25UeXBlIH0gZnJvbSBcIi4uLy4uL0lucHV0QWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgVXRpbGl0aWVzIGZyb20gXCIuLi8uLi9VdGlsaXRpZXNcIjtcclxuaW1wb3J0IFZlY3RvciBmcm9tIFwiLi4vLi4vVmVjdG9yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXJJbnB1dE1lc3NhZ2UgaW1wbGVtZW50cyBJTWVzc2FnZSB7XHJcbiAgICBtZXNzYWdlVHlwZSA9IE1lc3NhZ2VUeXBlLlBsYXllcklucHV0O1xyXG4gICAgbWluaW11bURhdGFMZW5ndGggPSA3O1xyXG5cclxuICAgIGlucHV0OiBJbnB1dEFjdGlvblR5cGU7XHJcbiAgICBzZXF1ZW5jZTogbnVtYmVyO1xyXG5cclxuICAgIC8vIFRoZXNlIGlzIGZvciBsb2NhbCB1c2UgYW5kIG5vdCBzZW50IHRvIHRoZSBzZXJ2ZXIuXHJcbiAgICBlbGFwc2VkOiBudW1iZXI7XHJcblxyXG4gICAgLy8gUGxheWVyIHN0YXRlIGZvciBoaXN0b3J5IHJlcGxheVxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjtcclxuXHJcbiAgICBsYXN0SnVtcCA9IGZhbHNlO1xyXG4gICAgbGFzdERvd24gPSBmYWxzZTtcclxuICAgIG1vdmVSaWdodCA9IGZhbHNlO1xyXG4gICAgbW92ZUxlZnQgPSBmYWxzZTtcclxuICAgIG1vdmVEb3duID0gZmFsc2U7XHJcbiAgICBqdW1waW5nID0gZmFsc2U7XHJcbiAgICBydW5uaW5nID0gZmFsc2U7XHJcblxyXG4gICAgcHVzaGVkUmlnaHRXYWxsID0gZmFsc2U7XHJcbiAgICBwdXNoZXNSaWdodFdhbGwgPSBmYWxzZTtcclxuICAgIHB1c2hlZExlZnRXYWxsID0gZmFsc2U7XHJcbiAgICBwdXNoZXNMZWZ0V2FsbCA9IGZhbHNlO1xyXG4gICAgd2FzT25Hcm91bmQgPSBmYWxzZTtcclxuICAgIG9uR3JvdW5kID0gZmFsc2U7XHJcbiAgICB3YXNBdENlaWxpbmcgPSBmYWxzZTtcclxuICAgIGF0Q2VpbGluZyA9IGZhbHNlO1xyXG4gICAgb25PbmVXYXlQbGF0Zm9ybSA9IGZhbHNlO1xyXG5cclxuICAgIGdldCByaWdodCgpIHsgcmV0dXJuIFV0aWxpdGllcy5GbGFnVGVzdCh0aGlzLmlucHV0LCBJbnB1dEFjdGlvblR5cGUuUmlnaHQpOyB9XHJcbiAgICBnZXQgbGVmdCgpIHsgcmV0dXJuIFV0aWxpdGllcy5GbGFnVGVzdCh0aGlzLmlucHV0LCBJbnB1dEFjdGlvblR5cGUuTGVmdCk7IH1cclxuICAgIGdldCB1cCgpIHsgcmV0dXJuIFV0aWxpdGllcy5GbGFnVGVzdCh0aGlzLmlucHV0LCBJbnB1dEFjdGlvblR5cGUuVXApOyB9XHJcbiAgICBnZXQgZG93bigpIHsgcmV0dXJuIFV0aWxpdGllcy5GbGFnVGVzdCh0aGlzLmlucHV0LCBJbnB1dEFjdGlvblR5cGUuRG93bik7IH1cclxuICAgIGdldCBqdW1wKCkgeyByZXR1cm4gVXRpbGl0aWVzLkZsYWdUZXN0KHRoaXMuaW5wdXQsIElucHV0QWN0aW9uVHlwZS5KdW1wKTsgfVxyXG4gICAgZ2V0IHJ1bigpIHsgcmV0dXJuIFV0aWxpdGllcy5GbGFnVGVzdCh0aGlzLmlucHV0LCBJbnB1dEFjdGlvblR5cGUuUnVuKTsgfVxyXG4gICAgZ2V0IGFjdGlvbjEoKSB7IHJldHVybiBVdGlsaXRpZXMuRmxhZ1Rlc3QodGhpcy5pbnB1dCwgSW5wdXRBY3Rpb25UeXBlLkFjdGlvbjEpOyB9XHJcbiAgICBnZXQgYWN0aW9uMigpIHsgcmV0dXJuIFV0aWxpdGllcy5GbGFnVGVzdCh0aGlzLmlucHV0LCBJbnB1dEFjdGlvblR5cGUuQWN0aW9uMik7IH1cclxuICAgIGdldCBhY3Rpb24zKCkgeyByZXR1cm4gVXRpbGl0aWVzLkZsYWdUZXN0KHRoaXMuaW5wdXQsIElucHV0QWN0aW9uVHlwZS5BY3Rpb24zKTsgfVxyXG5cclxuICAgIC8vIE5vdCB1c2VkIG9uIHRoZSBjbGllbnRcclxuICAgIGZyb21CeXRlcyhkYXRhOiBEYXRhVmlldywgbGl0dGxlRW5kaWFuOiBib29sZWFuKSB7IH1cclxuXHJcbiAgICB0b0J5dGVzKGxpdHRsZUVuZGlhbjogYm9vbGVhbikge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLm1pbmltdW1EYXRhTGVuZ3RoKTtcclxuICAgICAgICBjb25zdCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XHJcblxyXG4gICAgICAgIHZpZXcuc2V0VWludDgoMCwgdGhpcy5tZXNzYWdlVHlwZSk7XHJcbiAgICAgICAgdmlldy5zZXRVaW50MTYoMSwgdGhpcy5pbnB1dCwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB2aWV3LnNldEludDMyKDMsIHRoaXMuc2VxdWVuY2UsIGxpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgICAgIHJldHVybiBidWZmZXI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgSU1lc3NhZ2UgZnJvbSBcIi4vSU1lc3NhZ2VcIjtcclxuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwiLi9NZXNzYWdlVHlwZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9zaXRpb25NZXNzYWdlIGltcGxlbWVudHMgSU1lc3NhZ2Uge1xyXG4gICAgbWVzc2FnZVR5cGUgPSBNZXNzYWdlVHlwZS5Qb3NpdGlvbjtcclxuICAgIG1pbmltdW1EYXRhTGVuZ3RoID0gMjk7XHJcblxyXG4gICAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcG9zaXRpb25YOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcG9zaXRpb25ZOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdmVsb2NpdHlYOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdmVsb2NpdHlZOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdGljazogbnVtYmVyO1xyXG4gICAgcHVibGljIHNlcXVlbmNlOiBudW1iZXI7XHJcblxyXG4gICAgZnJvbUJ5dGVzKGRhdGE6IERhdGFWaWV3LCBsaXR0bGVFbmRpYW46IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmlkID0gZGF0YS5nZXRJbnQzMigxLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25YID0gZGF0YS5nZXRGbG9hdDMyKDUsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvblkgPSBkYXRhLmdldEZsb2F0MzIoOSwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5WCA9IGRhdGEuZ2V0RmxvYXQzMigxMywgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5WSA9IGRhdGEuZ2V0RmxvYXQzMigxNywgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB0aGlzLnRpY2sgPSBkYXRhLmdldEludDMyKDIxLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgIHRoaXMuc2VxdWVuY2UgPSBkYXRhLmdldEludDMyKDI1LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE5vdCB1c2VkIG9uIGNsaWVudC5cclxuICAgIHRvQnl0ZXMobGl0dGxlRW5kaWFuOiBib29sZWFuKTogQXJyYXlCdWZmZXIgeyByZXR1cm4gbnVsbDsgfVxyXG59IiwiaW1wb3J0IEVudGl0eSBmcm9tIFwiLi9FbnRpdHlcIjtcclxuaW1wb3J0IHsgSW5wdXRBY3Rpb25UeXBlIH0gZnJvbSBcIi4vSW5wdXRBY3Rpb25UeXBlXCI7XHJcbmltcG9ydCBVdGlsaXRpZXMgZnJvbSBcIi4vVXRpbGl0aWVzXCI7XHJcbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhbFBsYXllciBleHRlbmRzIEVudGl0eSB7XHJcblxyXG4gICAgcHVibGljIGxhc3RKdW1wID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbGFzdERvd24gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgc2VydmVyUG9zaXRpb24gPSBWZWN0b3IuemVyby5jbG9uZSgpO1xyXG5cclxuICAgIHB1YmxpYyBwbGF5ZXJVcGRhdGUoaW5wdXQ6IElucHV0QWN0aW9uVHlwZSwgZWxhcHNlZDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIC8vIEFwcGx5IG91ciBpbnB1dC5cclxuXHJcbiAgICAgICAgaWYgKFV0aWxpdGllcy5GbGFnVGVzdChpbnB1dCwgSW5wdXRBY3Rpb25UeXBlLlJpZ2h0KSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUxlZnQgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKFV0aWxpdGllcy5GbGFnVGVzdChpbnB1dCwgSW5wdXRBY3Rpb25UeXBlLkxlZnQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUxlZnQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUxlZnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChVdGlsaXRpZXMuRmxhZ1Rlc3QoaW5wdXQsIElucHV0QWN0aW9uVHlwZS5SdW4pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoVXRpbGl0aWVzLkZsYWdUZXN0KGlucHV0LCBJbnB1dEFjdGlvblR5cGUuSnVtcCkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RKdW1wKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmp1bXBpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SnVtcCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmp1bXBpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0SnVtcCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFV0aWxpdGllcy5GbGFnVGVzdChpbnB1dCwgSW5wdXRBY3Rpb25UeXBlLkRvd24pKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5sYXN0RG93bikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlRG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3REb3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZURvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0RG93biA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGVsYXBzZWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IElNZXNzYWdlIGZyb20gXCIuL0lNZXNzYWdlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vTWVzc2FnZVR5cGVcIjtcclxuaW1wb3J0IFBvc2l0aW9uTWVzc2FnZSBmcm9tIFwiLi9Qb3NpdGlvbk1lc3NhZ2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRlVXBkYXRlTWVzc2FnZSBpbXBsZW1lbnRzIElNZXNzYWdlIHtcclxuICAgIG1lc3NhZ2VUeXBlID0gTWVzc2FnZVR5cGUuU3RhdGVVcGRhdGU7XHJcbiAgICBtaW5pbXVtRGF0YUxlbmd0aCA9IDE7XHJcblxyXG4gICAgcGxheWVyczogQXJyYXk8UG9zaXRpb25NZXNzYWdlPjtcclxuXHJcbiAgICBmcm9tQnl0ZXMoZGF0YTogRGF0YVZpZXcsIGxpdHRsZUVuZGlhbjogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgbnVtUGxheWVycyA9IGRhdGEuZ2V0VWludDgoMSk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gMjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1QbGF5ZXJzOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcG9zID0gbmV3IFBvc2l0aW9uTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwb3MpO1xyXG5cclxuICAgICAgICAgICAgcG9zLmlkID0gZGF0YS5nZXRVaW50OChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICBwb3MucG9zaXRpb25YID0gZGF0YS5nZXRGbG9hdDMyKGluZGV4ICsgMSwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgcG9zLnBvc2l0aW9uWSA9IGRhdGEuZ2V0RmxvYXQzMihpbmRleCArIDUsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgIHBvcy52ZWxvY2l0eVggPSBkYXRhLmdldEZsb2F0MzIoaW5kZXggKyA5LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICBwb3MudmVsb2NpdHlZID0gZGF0YS5nZXRGbG9hdDMyKGluZGV4ICsgMTMsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgIHBvcy5zZXF1ZW5jZSA9IGRhdGEuZ2V0SW50MzIoaW5kZXggKyAxNywgbGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgICAgICAgIGluZGV4ICs9IDIxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBOb3QgdXNlZCBvbiBjbGllbnQuXHJcbiAgICB0b0J5dGVzKGxpdHRsZUVuZGlhbjogYm9vbGVhbik6IEFycmF5QnVmZmVyIHsgcmV0dXJuIG51bGw7IH1cclxufSIsImltcG9ydCBJTWVzc2FnZSBmcm9tIFwiLi9JTWVzc2FnZVwiO1xyXG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCIuL01lc3NhZ2VUeXBlXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vLi4vQ29sb3JcIjtcclxuaW1wb3J0IE5ldHdvcmtIZWxwZXIgZnJvbSBcIi4uL05ldHdvcmtIZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckluZm9NZXNzYWdlIGltcGxlbWVudHMgSU1lc3NhZ2Uge1xyXG4gICAgbWVzc2FnZVR5cGUgPSBNZXNzYWdlVHlwZS5QbGF5ZXJJbmZvO1xyXG4gICAgbWluaW11bURhdGFMZW5ndGggPSA2O1xyXG5cclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBjb2xvcjogQ29sb3I7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgZnJvbUJ5dGVzKGRhdGE6IERhdGFWaWV3LCBsaXR0bGVFbmRpYW46IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmlkID0gZGF0YS5nZXRVaW50OCgxKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG5ldyBDb2xvcihkYXRhLmdldFVpbnQ4KDIpLCBkYXRhLmdldFVpbnQ4KDMpLCBkYXRhLmdldFVpbnQ4KDQpKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gZGF0YS5nZXRVaW50OCg1KTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihsZW5ndGgpO1xyXG4gICAgICAgIGNvbnN0IG5hbWVWaWV3ID0gbmV3IERhdGFWaWV3KG5hbWVCdWZmZXIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZUJ1ZmZlci5ieXRlTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbmFtZVZpZXcuc2V0VWludDgoaSwgZGF0YS5nZXRVaW50OCg2ICsgaSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gTmV0d29ya0hlbHBlci5BcnJheUJ1ZmZlclRvU3RyaW5nKG5hbWVCdWZmZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE5vdCB1c2VkIG9uIGNsaWVudFxyXG4gICAgdG9CeXRlcyhsaXR0bGVFbmRpYW46IGJvb2xlYW4pIHsgcmV0dXJuIG5ldyBBcnJheUJ1ZmZlcigwKTsgfVxyXG59IiwiaW1wb3J0IElNZXNzYWdlIGZyb20gXCIuL0lNZXNzYWdlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vTWVzc2FnZVR5cGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckluZm9SZXF1ZXN0TWVzc2FnZSBpbXBsZW1lbnRzIElNZXNzYWdlIHtcclxuICAgIG1lc3NhZ2VUeXBlID0gTWVzc2FnZVR5cGUuUGxheWVySW5mb1JlcXVlc3Q7XHJcbiAgICBtaW5pbXVtRGF0YUxlbmd0aCA9IDI7XHJcblxyXG4gICAgaWQ6IG51bWJlcjtcclxuXHJcbiAgICAvLyBOb3Qgc2VudCBieSBzZXJ2ZXIuXHJcbiAgICBmcm9tQnl0ZXMoZGF0YTogRGF0YVZpZXcsIGxpdHRsZUVuZGlhbjogYm9vbGVhbikgeyB9XHJcblxyXG4gICAgdG9CeXRlcyhsaXR0bGVFbmRpYW46IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5taW5pbXVtRGF0YUxlbmd0aCk7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xyXG5cclxuICAgICAgICB2aWV3LnNldFVpbnQ4KDAsIHRoaXMubWVzc2FnZVR5cGUpO1xyXG4gICAgICAgIHZpZXcuc2V0VWludDgoMSwgdGhpcy5pZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBidWZmZXI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCIuL01lc3NhZ2VzL01lc3NhZ2VUeXBlXCI7XHJcbmltcG9ydCBQaW5nTWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlcy9QaW5nTWVzc2FnZVwiO1xyXG5pbXBvcnQgSm9pbkFjY2VwdGVkTWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlcy9Kb2luQWNjZXB0ZWRNZXNzYWdlXCI7XHJcbmltcG9ydCB7IFJlamVjdFJlYXNvbiB9IGZyb20gXCIuL01lc3NhZ2VzL1JlamVjdFJlYXNvblwiO1xyXG5pbXBvcnQgSU1lc3NhZ2UgZnJvbSBcIi4vTWVzc2FnZXMvSU1lc3NhZ2VcIjtcclxuaW1wb3J0IEpvaW5SZXF1ZXN0TWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlcy9Kb2luUmVxdWVzdE1lc3NhZ2VcIjtcclxuaW1wb3J0IHsgSW5wdXRBY3Rpb25UeXBlIH0gZnJvbSBcIi4uL0lucHV0QWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgUGxheWVySW5wdXRNZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VzL1BsYXllcklucHV0TWVzc2FnZVwiO1xyXG5pbXBvcnQgUG9zaXRpb25NZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VzL1Bvc2l0aW9uTWVzc2FnZVwiO1xyXG5pbXBvcnQgTG9jYWxQbGF5ZXIgZnJvbSBcIi4uL0xvY2FsUGxheWVyXCI7XHJcbmltcG9ydCBTdGF0ZVVwZGF0ZU1lc3NhZ2UgZnJvbSBcIi4vTWVzc2FnZXMvU3RhdGVVcGRhdGVNZXNzYWdlXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQ29sb3JcIjtcclxuaW1wb3J0IFBsYXllckluZm9NZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VzL1BsYXllckluZm9NZXNzYWdlXCI7XHJcbmltcG9ydCBQbGF5ZXJJbmZvUmVxdWVzdE1lc3NhZ2UgZnJvbSBcIi4vTWVzc2FnZXMvUGxheWVySW5mb1JlcXVlc3RNZXNzYWdlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZXR3b3JrQ2xpZW50IHtcclxuICAgIHByaXZhdGUgc29ja2V0OiBXZWJTb2NrZXQ7XHJcbiAgICBwcml2YXRlIHBpbmdUaW1lID0gMDtcclxuICAgIHByaXZhdGUgcGluZ0lEID0gMDtcclxuICAgIHByaXZhdGUgcGluZ1RpbWVvdXQgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3NvY2tldFJlYWR5ID0gZmFsc2U7XHJcbiAgICBnZXQgc29ja2V0UmVhZHkoKSB7IHJldHVybiB0aGlzLl9zb2NrZXRSZWFkeTsgfVxyXG5cclxuICAgIHByaXZhdGUgX2pvaW5lZEdhbWUgPSBmYWxzZTtcclxuICAgIGdldCBqb2luZWRHYW1lKCkgeyByZXR1cm4gdGhpcy5fam9pbmVkR2FtZTsgfVxyXG5cclxuICAgIHByaXZhdGUgX2NsaWVudFRpbWUgPSAwO1xyXG4gICAgZ2V0IGNsaWVudFRpbWUoKSB7IHJldHVybiB0aGlzLl9jbGllbnRUaW1lOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VydmVyVGltZSA9IDA7XHJcbiAgICBnZXQgc2VydmVyVGltZSgpIHsgcmV0dXJuIHRoaXMuX3NlcnZlclRpbWU7IH1cclxuXHJcbiAgICBwcml2YXRlIF9kZWxheSA9IDAuMTtcclxuICAgIGdldCBkZWxheSgpIHsgcmV0dXJuIHRoaXMuX2RlbGF5OyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VydmVySXNMaXR0bGVFbmRpYW4gPSBmYWxzZTtcclxuICAgIGdldCBzZXJ2ZXJJc0xpdHRsZUVuZGlhbigpIHsgcmV0dXJuIHRoaXMuX3NlcnZlcklzTGl0dGxlRW5kaWFuOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcGxheWVySUQgPSAwO1xyXG4gICAgZ2V0IHBsYXllcklEKCkgeyByZXR1cm4gdGhpcy5fcGxheWVySUQ7IH1cclxuXHJcbiAgICAvLyBDYWxsYmFja3NcclxuICAgIHB1YmxpYyBvbkpvaW5lZDogKGlkOiBudW1iZXIsIG5hbWU6IHN0cmluZywgY29sb3I6IENvbG9yKSA9PiB2b2lkO1xyXG4gICAgcHVibGljIG9uT3BlbjogKGV2OiBFdmVudCkgPT4gdm9pZDtcclxuICAgIHB1YmxpYyBvbkNsb3NlOiAoZXY6IENsb3NlRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgb25FcnJvcjogKGV2OiBFdmVudCkgPT4gdm9pZDtcclxuICAgIHB1YmxpYyBvbkRhdGE6IChldjogTWVzc2FnZUV2ZW50KSA9PiB2b2lkO1xyXG4gICAgcHVibGljIG9uTWVzc2FnZTogKG1zZzogSU1lc3NhZ2UpID0+IHZvaWQ7XHJcblxyXG4gICAgLy8gRGVidWdcclxuICAgIHByaXZhdGUgcGluZ0VsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgcHVibGljIGZha2VEZWxheTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29ubmVjdGlvblVybDogc3RyaW5nLCBwcml2YXRlIHBpbmdJbnRlcnZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5waW5nRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVidWctcGluZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbmRNZXNzYWdlKG1zZzogSU1lc3NhZ2UpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NvY2tldFJlYWR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG1zZy50b0J5dGVzKHRoaXMuX3NlcnZlcklzTGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZmFrZURlbGF5KSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpLCB0aGlzLmZha2VEZWxheSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU29ja2V0T3BlbmVkKGV2OiBFdmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJTb2NrZXQgb3BlbmVkXCIpO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXRSZWFkeSA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IG1zZyA9IG5ldyBKb2luUmVxdWVzdE1lc3NhZ2UoKTtcclxuICAgICAgICBtc2cubmFtZSA9IFwiRHVkZXIgXCIgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiA5OTk5KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShtc2cpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbk9wZW4pIHsgdGhpcy5vbk9wZW4oZXYpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNvY2tldENsb3NlZChldjogQ2xvc2VFdmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJTb2NrZXQgY2xvc2VkXCIpO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXRSZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2pvaW5lZEdhbWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbkNsb3NlKSB7IHRoaXMub25DbG9zZShldik7IH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU29ja2V0RXJyb3IoZXY6IEV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlNvY2tldCBlcnJvclwiKTtcclxuICAgICAgICBjb25zb2xlLmRpcihldik7XHJcbiAgICAgICAgaWYgKHRoaXMub25FcnJvcikgeyB0aGlzLm9uRXJyb3IoZXYpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNvY2tldE1lc3NhZ2UoZXY6IE1lc3NhZ2VFdmVudCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc01lc3NhZ2UoZXYuZGF0YSBhcyBBcnJheUJ1ZmZlcik7XHJcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7IHRoaXMub25EYXRhKGV2KTsgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGluZygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NvY2tldFJlYWR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1zZyA9IG5ldyBQaW5nTWVzc2FnZSgpO1xyXG4gICAgICAgIG1zZy5waW5nSUQgPSArK3RoaXMucGluZ0lEO1xyXG5cclxuICAgICAgICB0aGlzLnBpbmdUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gTWVzc2FnZSBwcm9jZXNzaW5nXHJcblxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzTWVzc2FnZShkYXRhOiBBcnJheUJ1ZmZlcikge1xyXG4gICAgICAgIGlmICghZGF0YSB8fCBkYXRhLmJ5dGVMZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVjZWl2ZWQgZW1wdHkgZGF0YSBmcm9tIHNlcnZlci5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoZGF0YSk7XHJcbiAgICAgICAgY29uc3QgbXNnVHlwZVZhbCA9IHZpZXcuZ2V0VWludDgoMCk7XHJcbiAgICAgICAgY29uc3QgbXNnVHlwZSA9IG1zZ1R5cGVWYWwgYXMgTWVzc2FnZVR5cGU7XHJcblxyXG4gICAgICAgIGxldCBtc2c6IElNZXNzYWdlID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG1zZ1R5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5TdGF0ZVVwZGF0ZTogbXNnID0gdGhpcy5wcm9jZXNzU3RhdGVVcGRhdGUodmlldyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlBpbmc6IG1zZyA9IHRoaXMucHJvY2Vzc1Bpbmcodmlldyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlBsYXllckluZm86IG1zZyA9IHRoaXMucHJvY2Vzc1BsYXllckluZm8odmlldyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkpvaW5BY2NlcHRlZDogbXNnID0gdGhpcy5wcm9jZXNzSm9pbkFjY2VwdGVkKHZpZXcpOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgUmVjZWl2ZWQgdW5zdXBwb3J0ZWQgbWVzc2FnZSB0eXBlOiAke21zZ1R5cGVWYWx9YCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtc2cgIT0gdW5kZWZpbmVkICYmIHRoaXMub25NZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvY2Vzc0pvaW5BY2NlcHRlZChkYXRhOiBEYXRhVmlldyk6IElNZXNzYWdlIHtcclxuICAgICAgICBjb25zdCBtc2cgPSBuZXcgSm9pbkFjY2VwdGVkTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5ieXRlTGVuZ3RoIDwgbXNnLm1pbmltdW1EYXRhTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZWNlaXZlZCBpbnZhbGlkIEpvaW5BY2NlcHQgbWVzc2FnZS5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbXNnLmZyb21CeXRlcyhkYXRhLCB0aGlzLl9zZXJ2ZXJJc0xpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgICAgIHRoaXMuX3NlcnZlcklzTGl0dGxlRW5kaWFuID0gbXNnLmlzTGl0dGxlRW5kaWFuO1xyXG5cclxuICAgICAgICBpZiAobXNnLmFjY2VwdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXllcklEID0gbXNnLmlkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fam9pbmVkR2FtZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uSm9pbmVkKSB7IHRoaXMub25Kb2luZWQodGhpcy5fcGxheWVySUQsIG1zZy5uYW1lLCBtc2cuY29sb3IpOyB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBpbmcoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcmVqZWN0UmVhc29uO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG1zZy5yZWplY3RSZWFzb24pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgUmVqZWN0UmVhc29uLkJhbm5lZDogcmVqZWN0UmVhc29uID0gXCJZb3UgaGF2ZSBiZWVuIGJhbm5lZFwiOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgUmVqZWN0UmVhc29uLk5hbWVJblVzZTogcmVqZWN0UmVhc29uID0gXCJUaGUgY2hvc2VuIG5hbWUgaXMgYWxyZWFkeSBpbiB1c2VcIjsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJlamVjdFJlYXNvbi5Ub29NYW55UGxheWVyczogcmVqZWN0UmVhc29uID0gXCJUaGUgc2VydmVyIGFscmVhZHkgaGFzIHRoZSBtYXhpbXVtIGFsbG93ZWQgcGxheWVyc1wiOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJlamVjdFJlYXNvbiA9IFwiVW5rbm93blwiOyBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byBqb2luIGdhbWU6IFwiICsgcmVqZWN0UmVhc29uKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbXNnO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvY2Vzc1BpbmcoZGF0YTogRGF0YVZpZXcpOiBJTWVzc2FnZSB7XHJcbiAgICAgICAgY29uc3QgbXNnID0gbmV3IFBpbmdNZXNzYWdlKCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmJ5dGVMZW5ndGggPCBtc2cubWluaW11bURhdGFMZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVjZWl2ZWQgaW52YWxpZCBQaW5nIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbXNnLmZyb21CeXRlcyhkYXRhLCB0aGlzLl9zZXJ2ZXJJc0xpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY2VpdmVUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuX2RlbGF5ID0gKHJlY2VpdmVUaW1lIC0gdGhpcy5waW5nVGltZSkgLyAyMDAwOyAvLyBIYWxmIG9mIHRoZSB0aW1lIGFuZCBtcyB0byBzZWNvbmRzLlxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc29ja2V0UmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5waW5nVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5waW5nKCksIHRoaXMucGluZ0ludGVydmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGluZ0VsZW1lbnQuaW5uZXJUZXh0ID0gTWF0aC5yb3VuZCh0aGlzLl9kZWxheSAqIDIwMDApICsgXCJcIjtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNlcnZlciBhdmVyYWdlIGZyYW1lIHRpbWU6IFwiICsgbXNnLmF2Z0ZyYW1lVGltZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBtc2c7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzU3RhdGVVcGRhdGUoZGF0YTogRGF0YVZpZXcpOiBJTWVzc2FnZSB7XHJcbiAgICAgICAgY29uc3QgbXNnID0gbmV3IFN0YXRlVXBkYXRlTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5ieXRlTGVuZ3RoIDwgbXNnLm1pbmltdW1EYXRhTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlY2VpdmVkIGludmFsaWQgU3RhdGUgVXBkYXRlIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbXNnLmZyb21CeXRlcyhkYXRhLCB0aGlzLl9zZXJ2ZXJJc0xpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgICAgIHJldHVybiBtc2c7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzUGxheWVySW5mbyhkYXRhOiBEYXRhVmlldyk6IElNZXNzYWdlIHtcclxuICAgICAgICBjb25zdCBtc2cgPSBuZXcgUGxheWVySW5mb01lc3NhZ2UoKTtcclxuICAgICAgICBpZiAoZGF0YS5ieXRlTGVuZ3RoIDwgbXNnLm1pbmltdW1EYXRhTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlY2VpdmVkIGludmFsaWQgUGxheWVyIEluZm8gbWVzc2FnZS5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtc2cuZnJvbUJ5dGVzKGRhdGEsIHRoaXMuX3NlcnZlcklzTGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1zZztcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHB1YmxpYyBjb25uZWN0KCkge1xyXG4gICAgICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLmNvbm5lY3Rpb25VcmwpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9IHRoaXMub25Tb2NrZXRPcGVuZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gdGhpcy5vblNvY2tldENsb3NlZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSB0aGlzLm9uU29ja2V0RXJyb3IuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLm9uU29ja2V0TWVzc2FnZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCkge1xyXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2NsaWVudFRpbWUgKz0gZWxhcHNlZDtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXJUaW1lICs9IGVsYXBzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUlucHV0TWVzc2FnZShpbnB1dDogSW5wdXRBY3Rpb25UeXBlLCBzZXF1ZW5jZTogbnVtYmVyLCBwbGF5ZXI6IExvY2FsUGxheWVyKSB7XHJcbiAgICAgICAgY29uc3QgbXNnID0gbmV3IFBsYXllcklucHV0TWVzc2FnZSgpO1xyXG5cclxuICAgICAgICBtc2cuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICBtc2cuc2VxdWVuY2UgPSBzZXF1ZW5jZTtcclxuXHJcbiAgICAgICAgLy8gVGhlc2UgYXJlIHVzZWQgZm9yIHJld2luZGluZyB0aGUgcGxheWVyIGZvciBzZXJ2ZXIgcmVjb25jaWxpYXRpb24uXHJcbiAgICAgICAgLy8gVGhleSBhcmVuJ3Qgc2VudCB0byB0aGUgc2VydmVyLlxyXG4gICAgICAgIG1zZy52ZWxvY2l0eSA9IHBsYXllci52ZWxvY2l0eS5jbG9uZSgpO1xyXG4gICAgICAgIG1zZy5sYXN0SnVtcCA9IHBsYXllci5sYXN0SnVtcDtcclxuICAgICAgICBtc2cubGFzdERvd24gPSBwbGF5ZXIubGFzdERvd247XHJcbiAgICAgICAgbXNnLm1vdmVSaWdodCA9IHBsYXllci5tb3ZlUmlnaHQ7XHJcbiAgICAgICAgbXNnLm1vdmVMZWZ0ID0gcGxheWVyLm1vdmVMZWZ0O1xyXG4gICAgICAgIG1zZy5tb3ZlRG93biA9IHBsYXllci5tb3ZlRG93bjtcclxuICAgICAgICBtc2cuanVtcGluZyA9IHBsYXllci5qdW1waW5nO1xyXG4gICAgICAgIG1zZy5ydW5uaW5nID0gcGxheWVyLnJ1bm5pbmc7XHJcbiAgICAgICAgbXNnLnB1c2hlZFJpZ2h0V2FsbCA9IHBsYXllci5wdXNoZWRSaWdodFdhbGw7XHJcbiAgICAgICAgbXNnLnB1c2hlc1JpZ2h0V2FsbCA9IHBsYXllci5wdXNoZXNSaWdodFdhbGw7XHJcbiAgICAgICAgbXNnLnB1c2hlZExlZnRXYWxsID0gcGxheWVyLnB1c2hlZExlZnRXYWxsO1xyXG4gICAgICAgIG1zZy5wdXNoZXNMZWZ0V2FsbCA9IHBsYXllci5wdXNoZXNMZWZ0V2FsbDtcclxuICAgICAgICBtc2cud2FzT25Hcm91bmQgPSBwbGF5ZXIud2FzT25Hcm91bmQ7XHJcbiAgICAgICAgbXNnLm9uR3JvdW5kID0gcGxheWVyLm9uR3JvdW5kO1xyXG4gICAgICAgIG1zZy53YXNBdENlaWxpbmcgPSBwbGF5ZXIud2FzQXRDZWlsaW5nO1xyXG4gICAgICAgIG1zZy5hdENlaWxpbmcgPSBwbGF5ZXIuYXRDZWlsaW5nO1xyXG4gICAgICAgIG1zZy5vbk9uZVdheVBsYXRmb3JtID0gcGxheWVyLm9uT25lV2F5UGxhdGZvcm07XHJcblxyXG4gICAgICAgIHJldHVybiBtc2c7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbmRJbnB1dChtc2c6IFBsYXllcklucHV0TWVzc2FnZSkge1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGxheWVySW5mbyhpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgbXNnID0gbmV3IFBsYXllckluZm9SZXF1ZXN0TWVzc2FnZSgpO1xyXG4gICAgICAgIG1zZy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobXNnKTtcclxuICAgIH1cclxufSIsImltcG9ydCBJbnB1dE1hbmFnZXIgZnJvbSBcIi4vSW5wdXRNYW5hZ2VyXCI7XHJcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4vQ2FtZXJhXCI7XHJcbmltcG9ydCBNb3ZpbmdPYmplY3QgZnJvbSBcIi4vTW92aW5nT2JqZWN0XCI7XHJcbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XHJcbmltcG9ydCBFbnRpdHkgZnJvbSBcIi4vRW50aXR5XCI7XHJcbmltcG9ydCBDb25zdGFudHMgZnJvbSBcIi4vQ29uc3RhbnRzXCI7XHJcbmltcG9ydCBJUG9pbnQgZnJvbSBcIi4vSVBvaW50XCI7XHJcbmltcG9ydCB7IElucHV0QWN0aW9uVHlwZSB9IGZyb20gXCIuL0lucHV0QWN0aW9uVHlwZVwiO1xyXG5pbXBvcnQgeyBNYXAsIE1hcFRpbGVUeXBlIH0gZnJvbSBcIi4vTWFwXCI7XHJcbmltcG9ydCBOZXR3b3JrQ2xpZW50IGZyb20gXCIuL05ldHdvcmsvTmV0d29ya0NsaWVudFwiO1xyXG5pbXBvcnQgUGxheWVySW5wdXRNZXNzYWdlIGZyb20gXCIuL05ldHdvcmsvTWVzc2FnZXMvUGxheWVySW5wdXRNZXNzYWdlXCI7XHJcbmltcG9ydCBJTWVzc2FnZSBmcm9tIFwiLi9OZXR3b3JrL01lc3NhZ2VzL0lNZXNzYWdlXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vTmV0d29yay9NZXNzYWdlcy9NZXNzYWdlVHlwZVwiO1xyXG5pbXBvcnQgVXRpbGl0aWVzIGZyb20gXCIuL1V0aWxpdGllc1wiO1xyXG5pbXBvcnQgTG9jYWxQbGF5ZXIgZnJvbSBcIi4vTG9jYWxQbGF5ZXJcIjtcclxuaW1wb3J0IFBvc2l0aW9uTWVzc2FnZSBmcm9tIFwiLi9OZXR3b3JrL01lc3NhZ2VzL1Bvc2l0aW9uTWVzc2FnZVwiO1xyXG5pbXBvcnQgSm9pbkFjY2VwdGVkTWVzc2FnZSBmcm9tIFwiLi9OZXR3b3JrL01lc3NhZ2VzL0pvaW5BY2NlcHRlZE1lc3NhZ2VcIjtcclxuaW1wb3J0IFN0YXRlVXBkYXRlTWVzc2FnZSBmcm9tIFwiLi9OZXR3b3JrL01lc3NhZ2VzL1N0YXRlVXBkYXRlTWVzc2FnZVwiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcclxuaW1wb3J0IFBsYXllckluZm9NZXNzYWdlIGZyb20gXCIuL05ldHdvcmsvTWVzc2FnZXMvUGxheWVySW5mb01lc3NhZ2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuZ2luZSB7XHJcbiAgICBwdWJsaWMgY2xlYXJDb2xvciA9IFwiIzMzNFwiO1xyXG5cclxuICAgIHByaXZhdGUgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSBjYW1lcmE6IENhbWVyYTtcclxuICAgIHByaXZhdGUgaW5wdXQ6IElucHV0TWFuYWdlcjtcclxuICAgIHByaXZhdGUgbmV0d29ya0NsaWVudDogTmV0d29ya0NsaWVudDtcclxuXHJcbiAgICBwcml2YXRlIHRpbWVyV29ya2VyOiBXb3JrZXI7XHJcbiAgICBwcml2YXRlIGxhc3RVcGRhdGU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgdGlja0ludGVydmFsOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGhhc1BlcmZUaW1lciA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSByZW5kZXJUaW1lID0gMDtcclxuXHJcbiAgICBwcml2YXRlIHJlYWR5ID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbWFwOiBNYXA7XHJcbiAgICBwcml2YXRlIHBsYXllcjogTG9jYWxQbGF5ZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBvdGhlclBsYXllcnM6IEFycmF5PEVudGl0eT4gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHRpY2tJRCA9IDA7XHJcbiAgICBwcml2YXRlIGlucHV0U2VxdWVuY2UgPSAwO1xyXG4gICAgcHJpdmF0ZSBpbnB1dEhpc3Rvcnk6IEFycmF5PFBsYXllcklucHV0TWVzc2FnZT4gPSBbXTtcclxuICAgIHByaXZhdGUgbGFzdElucHV0OiBJbnB1dEFjdGlvblR5cGUgPSBJbnB1dEFjdGlvblR5cGUuTm9uZTtcclxuXHJcbiAgICBwcml2YXRlIGZpcnN0RHJhdyA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2NoZW1lID0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgPyBcIndzc1wiIDogXCJ3c1wiO1xyXG4gICAgICAgIGNvbnN0IHBvcnQgPSBkb2N1bWVudC5sb2NhdGlvbi5wb3J0ID8gKFwiOlwiICsgZG9jdW1lbnQubG9jYXRpb24ucG9ydCkgOiBcIlwiO1xyXG4gICAgICAgIGNvbnN0IGNvbm5lY3Rpb25VcmwgPSBzY2hlbWUgKyBcIjovL1wiICsgZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWUgKyBwb3J0O1xyXG4gICAgICAgIHRoaXMubmV0d29ya0NsaWVudCA9IG5ldyBOZXR3b3JrQ2xpZW50KGNvbm5lY3Rpb25VcmwsIDEwMDApO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmtDbGllbnQuZmFrZURlbGF5ID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5uZXR3b3JrQ2xpZW50Lm9uSm9pbmVkID0gdGhpcy5vbkpvaW5lZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubmV0d29ya0NsaWVudC5vbk1lc3NhZ2UgPSB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmtDbGllbnQuY29ubmVjdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBDYW1lcmEodGhpcy5jb250ZXh0KTtcclxuICAgICAgICB0aGlzLmNhbWVyYS5kaXN0YW5jZSA9IDI1MDA7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBJbnB1dCgpO1xyXG5cclxuICAgICAgICBpZiAod2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cpIHtcclxuICAgICAgICAgICAgdGhpcy5oYXNQZXJmVGltZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4gdGhpcy51cGRhdGVDYW52YXNTaXplKCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FudmFzU2l6ZSgpO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBXYWl0IHVudGlsIGpvaW4gYWNjZXB0ZWQgdG8gc3RhcnQgZ2FtZS5cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgTG9jYWxQbGF5ZXIodGhpcywgVmVjdG9yLnplcm8uY2xvbmUoKSwgbmV3IFZlY3RvcihDb25zdGFudHMudGlsZVNpemUgKiAwLjUgKiAwLjgsIENvbnN0YW50cy50aWxlU2l6ZSAqIDAuNSAqIDEuNSkpO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnBvc2l0aW9uLnggPSBDb25zdGFudHMudGlsZVNpemUgKiAzMDtcclxuICAgICAgICB0aGlzLnBsYXllci5wb3NpdGlvbi55ID0gQ29uc3RhbnRzLnRpbGVTaXplICogOTg7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZHJhd1Bvc2l0aW9uLnggPSBDb25zdGFudHMudGlsZVNpemUgKiAzMDtcclxuICAgICAgICB0aGlzLnBsYXllci5kcmF3UG9zaXRpb24ueSA9IENvbnN0YW50cy50aWxlU2l6ZSAqIDk4O1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYS5tb3ZlVG8odGhpcy5wbGF5ZXIucG9zaXRpb24ueCwgdGhpcy5wbGF5ZXIucG9zaXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEuZm9sbG93KHRoaXMucGxheWVyLmRyYXdQb3NpdGlvbiwgMC4xKTtcclxuXHJcbiAgICAgICAgdGhpcy50aW1lcldvcmtlciA9IG5ldyBXb3JrZXIoXCIvanMvdGltZXIuanNcIik7XHJcbiAgICAgICAgdGhpcy50aW1lcldvcmtlci5vbm1lc3NhZ2UgPSAoKSA9PiB0aGlzLnRpY2soKTtcclxuICAgICAgICB0aGlzLnRpbWVyV29ya2VyLnBvc3RNZXNzYWdlKHsgaWQ6IDEsIHR5cGU6IFwic2V0SW50ZXJ2YWxcIiwgdGltZTogMTYgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cElucHV0KCkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRNYW5hZ2VyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkSW5wdXRBY3Rpb24oSW5wdXRBY3Rpb25UeXBlLkxlZnQsIFs2NSwgMzddKTtcclxuICAgICAgICB0aGlzLmlucHV0LmFkZElucHV0QWN0aW9uKElucHV0QWN0aW9uVHlwZS5SaWdodCwgWzY4LCAzOV0pO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkSW5wdXRBY3Rpb24oSW5wdXRBY3Rpb25UeXBlLlVwLCBbODcsIDM4XSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRJbnB1dEFjdGlvbihJbnB1dEFjdGlvblR5cGUuRG93biwgWzgzLCA0MF0pO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkSW5wdXRBY3Rpb24oSW5wdXRBY3Rpb25UeXBlLkp1bXAsIFszMl0pO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkSW5wdXRBY3Rpb24oSW5wdXRBY3Rpb25UeXBlLlJ1biwgWzE2XSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRJbnB1dEFjdGlvbihJbnB1dEFjdGlvblR5cGUuQWN0aW9uMSwgWzc0LCA2N10pO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkSW5wdXRBY3Rpb24oSW5wdXRBY3Rpb25UeXBlLkFjdGlvbjIsIFs3NSwgODhdKTtcclxuICAgICAgICB0aGlzLmlucHV0LmFkZElucHV0QWN0aW9uKElucHV0QWN0aW9uVHlwZS5BY3Rpb24zLCBbNzYsIDkwXSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRJbnB1dEFjdGlvbihJbnB1dEFjdGlvblR5cGUuU2VsZWN0LCBbMTMsIDMyXSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRJbnB1dEFjdGlvbihJbnB1dEFjdGlvblR5cGUuQ2FuY2VsLCBbMjcsIDhdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFyU2NyZWVuKGNsZWFyQ29sb3I6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBjbGVhckNvbG9yO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUNhbnZhc1NpemUoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVZpZXdwb3J0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3UmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIsIGNvbG9yOiBzdHJpbmcpIHtcclxuICAgICAgICB4IC09IHcgLyAyO1xyXG4gICAgICAgIHkgLT0gaCAvIDI7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdOYW1lKG5hbWU6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gXCIyMHB4IEFyaWFsXCI7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dChuYW1lKTtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQobmFtZSwgeCAtIChzaXplLndpZHRoICogMC41KSwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFbGFzcGVkVGltZSgpIHtcclxuICAgICAgICBsZXQgbm93OiBudW1iZXI7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzUGVyZlRpbWVyKSB7XHJcbiAgICAgICAgICAgIG5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IG5vdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGVsYXBzZWQgPSAobm93IC0gdGhpcy5sYXN0VXBkYXRlKSAvIDEwMDA7XHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gbm93O1xyXG4gICAgICAgIHJldHVybiBlbGFwc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGljaygpIHtcclxuICAgICAgICBjb25zdCBlbGFwc2VkID0gdGhpcy5nZXRFbGFzcGVkVGltZSgpO1xyXG5cclxuICAgICAgICBpZiAoZWxhcHNlZCA+IDAuMDIwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlRpY2sgdGltZSBleGNlZWRlZCAyMG1zOiBcIiArIGVsYXBzZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29ya0NsaWVudC51cGRhdGUoZWxhcHNlZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbGFwc2VkID49IDAuMDMyKSB7XHJcbiAgICAgICAgICAgIC8vIFRpY2sgdGltZSBpcyB3YXkgdG9vIGhpZ2gsIGxldCdzIGRvIG11bHRpcGxlIHVwZGF0ZXMgdGhpcyB0aWNrLlxyXG4gICAgICAgICAgICBsZXQgcmVtYWluID0gZWxhcHNlZDtcclxuICAgICAgICAgICAgd2hpbGUgKHJlbWFpbiA+IDAuMDgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRtcEVsYXBzZWQgPSBNYXRoLm1pbigwLjAxNiwgcmVtYWluKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV0d29ya0NsaWVudC51cGRhdGUodG1wRWxhcHNlZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0bXBFbGFwc2VkKTtcclxuICAgICAgICAgICAgICAgIHJlbWFpbiAtPSAwLjAxNjtcclxuICAgICAgICAgICAgICAgIHRoaXMudGlja0lEKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm5ldHdvcmtDbGllbnQudXBkYXRlKGVsYXBzZWQpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShlbGFwc2VkKTtcclxuICAgICAgICAgICAgdGhpcy50aWNrSUQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5maXJzdERyYXcpIHtcclxuICAgICAgICAgICAgdGhpcy5maXJzdERyYXcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnB1dFRpbWUgPSAwO1xyXG4gICAgcHJpdmF0ZSBsYXN0TXNnVGltZSA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBmcmFtZVRpbWVzOiBBcnJheTxudW1iZXI+ID0gW107XHJcbiAgICBcclxuICAgIHByaXZhdGUgdXBkYXRlKGVsYXBzZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaW5wdXQudXBkYXRlKGVsYXBzZWQpO1xyXG5cclxuICAgICAgICB0aGlzLmZyYW1lVGltZXMucHVzaChlbGFwc2VkICogMTAwMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWVUaW1lcy5sZW5ndGggPiAxMDApIHtcclxuICAgICAgICAgICAgY29uc3QgdG90YWwgPSB0aGlzLmZyYW1lVGltZXMucmVkdWNlKChhY2MsIGN1cikgPT4gYWNjICsgY3VyKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgQXZnIGZyYW1ldGltZTogJHt0b3RhbCAvIHRoaXMuZnJhbWVUaW1lcy5sZW5ndGh9IG1zYCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWVUaW1lcy5zcGxpY2UoMCwgdGhpcy5mcmFtZVRpbWVzLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlucHV0VGltZSArPSBlbGFwc2VkO1xyXG5cclxuICAgICAgICBsZXQgaW5wdXRBY3Rpb25zID0gSW5wdXRBY3Rpb25UeXBlLk5vbmU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgVXRpbGl0aWVzLkFsbElucHV0QWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBVdGlsaXRpZXMuQWxsSW5wdXRBY3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dC5nZXRBY3Rpb24oYWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgaW5wdXRBY3Rpb25zIHw9IGFjdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9pZiAoIXRoaXMuaW5wdXQuZ2V0QWN0aW9uRG93bihJbnB1dEFjdGlvblR5cGUuSnVtcCkpIHtcclxuICAgICAgICAvLyAgICAvLyBPbmx5IHNldCBqdW1wIHRvIHRydWUgZHVyaW5nIHRoZSBmcmFtZSBpdCB3YXMgcHJlc3NlZC5cclxuICAgICAgICAvLyAgICBpbnB1dEFjdGlvbnMgPSBVdGlsaXRpZXMuRmxhZ1Vuc2V0KGlucHV0QWN0aW9ucywgSW5wdXRBY3Rpb25UeXBlLkp1bXApO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvL2lmICghdGhpcy5pbnB1dC5nZXRBY3Rpb25Eb3duKElucHV0QWN0aW9uVHlwZS5Eb3duKSkge1xyXG4gICAgICAgIC8vICAgIC8vIE9ubHkgc2V0IGZhbGwtdGhyb3VnaCB0byB0cnVlIGR1cmluZyB0aGUgZnJhbWUgaXQgd2FzIHByZXNzZWQuXHJcbiAgICAgICAgLy8gICAgaW5wdXRBY3Rpb25zID0gVXRpbGl0aWVzLkZsYWdVbnNldChpbnB1dEFjdGlvbnMsIElucHV0QWN0aW9uVHlwZS5Eb3duKTtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgY29uc3QgbXNnID0gdGhpcy5uZXR3b3JrQ2xpZW50LmNyZWF0ZUlucHV0TWVzc2FnZShpbnB1dEFjdGlvbnMsICsrdGhpcy5pbnB1dFNlcXVlbmNlLCB0aGlzLnBsYXllcik7XHJcbiAgICAgICAgdGhpcy5pbnB1dEhpc3RvcnkucHVzaChtc2cpO1xyXG5cclxuICAgICAgICB0aGlzLmlucHV0VGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy5sYXN0TXNnVGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy5uZXR3b3JrQ2xpZW50LnNlbmRJbnB1dChtc2cpO1xyXG5cclxuICAgICAgICAvL2lmIChpbnB1dEFjdGlvbnMgIT09IHRoaXMubGFzdElucHV0IHx8IHRoaXMuaW5wdXRUaW1lID4gMSkge1xyXG4gICAgICAgIC8vICAgIC8vIE9ubHkgc2VuZCB0byBzZXJ2ZXIgd2hlbiB0aGUgc3RhdGUgY2hhbmdlcyBvciBhZnRlciAxIHNlY29uZC5cclxuXHJcbiAgICAgICAgLy8gICAgY29uc3QgbXNnID0gdGhpcy5uZXR3b3JrQ2xpZW50LmNyZWF0ZUlucHV0TWVzc2FnZShpbnB1dEFjdGlvbnMsICsrdGhpcy5pbnB1dFNlcXVlbmNlLCB0aGlzLnRpY2tJRCwgdGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgIC8vICAgIHRoaXMuaW5wdXRIaXN0b3J5LnB1c2gobXNnKTtcclxuXHJcbiAgICAgICAgLy8gICAgdGhpcy5pbnB1dFRpbWUgPSAwO1xyXG4gICAgICAgIC8vICAgIHRoaXMubGFzdE1zZ1RpbWUgPSAwO1xyXG4gICAgICAgIC8vICAgIHRoaXMubmV0d29ya0NsaWVudC5zZW5kSW5wdXQobXNnKTtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgdGhpcy5sYXN0TXNnVGltZSArPSBlbGFwc2VkO1xyXG5cclxuICAgICAgICB0aGlzLmxhc3RJbnB1dCA9IGlucHV0QWN0aW9ucztcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIG90aGVyIHBsYXllcnMuXHJcbiAgICAgICAgZm9yIChsZXQgZSA9IHRoaXMub3RoZXJQbGF5ZXJzLmxlbmd0aCAtIDE7IGUgPj0gMDsgZS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMub3RoZXJQbGF5ZXJzW2VdO1xyXG4gICAgICAgICAgICBlbnRpdHkubGFzdFVwZGF0ZSArPSBlbGFwc2VkO1xyXG4gICAgICAgICAgICBpZiAoZW50aXR5Lmxhc3RVcGRhdGUgPj0gNSkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZW4ndCByZWNlaXZlZCBhbiB1cGRhdGUgZm9yIHRoaXMgcGxheWVyIGluIDUgc2Vjb25kc1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZW0uXHJcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVyUGxheWVycy5zcGxpY2UoZSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyLnBsYXllclVwZGF0ZShpbnB1dEFjdGlvbnMsIGVsYXBzZWQpO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZShlbGFwc2VkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxlcnBEcmF3UG9zaXRpb24oZHJhd1Bvc2l0aW9uOiBWZWN0b3IsIHJlYWxQb3NpdGlvbjogVmVjdG9yLCBhbW91bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGRyYXdEaXN0ID0gVmVjdG9yLnN1YnRyYWN0KGRyYXdQb3NpdGlvbiwgcmVhbFBvc2l0aW9uKS5sZW5ndGgoKTtcclxuICAgICAgICBpZiAoZHJhd0Rpc3QgPiAxMDApIHtcclxuICAgICAgICAgICAgLy8gVG9vIGZhciwgc25hcCB0byByZWFsIHBvc2l0aW9uLlxyXG4gICAgICAgICAgICBkcmF3UG9zaXRpb24uY29weUZyb20ocmVhbFBvc2l0aW9uKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRyYXdEaXN0ID4gMCkge1xyXG4gICAgICAgICAgICBpZiAoZHJhd0Rpc3QgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ2xvc2UgZW5vdWdoLCBzbmFwIHRvIHJlYWwgcG9zaXRpb24uXHJcbiAgICAgICAgICAgICAgICBkcmF3UG9zaXRpb24uY29weUZyb20ocmVhbFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFZlY3Rvci5sZXJwKGRyYXdQb3NpdGlvbiwgcmVhbFBvc2l0aW9uLCBhbW91bnQsIGRyYXdQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGRyYXdEaXN0IDwgMCkge1xyXG4gICAgICAgICAgICAvLyBUaGlzIHNob3VsZG4ndCBiZSBwb3NzaWJsZSwgYnV0IEkgc2VlbiBpdCBvbmNlLCBzbyBsZXQncyBqdXN0IGNoZWNrIGZvciBpdCBhbmQgcmVzZXQgb3VyIGRyYXcgcG9zaXRpb24uXHJcbiAgICAgICAgICAgIGRyYXdQb3NpdGlvbi5jb3B5RnJvbShyZWFsUG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXcoKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhclNjcmVlbih0aGlzLmNsZWFyQ29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLmxlcnBEcmF3UG9zaXRpb24odGhpcy5wbGF5ZXIuZHJhd1Bvc2l0aW9uLCB0aGlzLnBsYXllci5wb3NpdGlvbiwgMC42NSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy90aGlzLmNhbWVyYS5tb3ZlVG8odGhpcy5wbGF5ZXIuZHJhd1Bvc2l0aW9uLngsIHRoaXMucGxheWVyLmRyYXdQb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW1lcmEuYmVnaW4oKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLm1hcC5oZWlnaHQ7IHkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMubWFwLndpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLm1hcC50aWxlc1t5XVt4XTtcclxuICAgICAgICAgICAgICAgIGlmICh0aWxlID09PSBNYXBUaWxlVHlwZS5FbXB0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aWxlID09PSBNYXBUaWxlVHlwZS5CbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1JlY3QoeCAqIENvbnN0YW50cy50aWxlU2l6ZSwgeSAqIENvbnN0YW50cy50aWxlU2l6ZSwgQ29uc3RhbnRzLnRpbGVTaXplLCBDb25zdGFudHMudGlsZVNpemUsIFwiIzM1MUUwQlwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGlsZSA9PT0gTWFwVGlsZVR5cGUuT25lV2F5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3UmVjdCh4ICogQ29uc3RhbnRzLnRpbGVTaXplLCB5ICogQ29uc3RhbnRzLnRpbGVTaXplIC0gQ29uc3RhbnRzLnRpbGVTaXplICogMC4yNSwgQ29uc3RhbnRzLnRpbGVTaXplLCBDb25zdGFudHMudGlsZVNpemUgKiAwLjUsIFwiIzZBM0YxQ1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyU2l6ZSA9IHRoaXMucGxheWVyLmFhYmIuZ2V0U2l6ZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBkZWxFbnRpdGllczogQXJyYXk8RW50aXR5PiA9IFtdO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG90aGVyIHBsYXllcnMuXHJcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIHRoaXMub3RoZXJQbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGlmICghZS5yZWFkeSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICB0aGlzLmxlcnBEcmF3UG9zaXRpb24oZS5kcmF3UG9zaXRpb24sIGUucG9zaXRpb24sIDAuNTUpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdSZWN0KGUuZHJhd1Bvc2l0aW9uLngsIGUuZHJhd1Bvc2l0aW9uLnksIHBsYXllclNpemUueCAqIHRoaXMucGxheWVyLnNjYWxlLngsIHBsYXllclNpemUueSAqIHRoaXMucGxheWVyLnNjYWxlLnksIGUuY29sb3IuY3NzKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3TmFtZShlLm5hbWUsIGUuZHJhd1Bvc2l0aW9uLngsIGUuZHJhd1Bvc2l0aW9uLnkgLSBwbGF5ZXJTaXplLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmRyYXdSZWN0KHRoaXMucGxheWVyLnBvc2l0aW9uLngsIHRoaXMucGxheWVyLnBvc2l0aW9uLnksIHBsYXllclNpemUueCAqIHRoaXMucGxheWVyLnNjYWxlLngsIHBsYXllclNpemUueSAqIHRoaXMucGxheWVyLnNjYWxlLnksIHRoaXMucGxheWVyLmNvbG9yLmNzcyk7XHJcbiAgICAgICAgLy90aGlzLmRyYXdSZWN0KHRoaXMucGxheWVyLmRyYXdQb3NpdGlvbi54LCB0aGlzLnBsYXllci5kcmF3UG9zaXRpb24ueSwgcGxheWVyU2l6ZS54ICogdGhpcy5wbGF5ZXIuc2NhbGUueCwgcGxheWVyU2l6ZS55ICogdGhpcy5wbGF5ZXIuc2NhbGUueSwgdGhpcy5wbGF5ZXIuY29sb3IpO1xyXG4gICAgICAgIHRoaXMuZHJhd05hbWUodGhpcy5wbGF5ZXIubmFtZSwgdGhpcy5wbGF5ZXIucG9zaXRpb24ueCwgdGhpcy5wbGF5ZXIucG9zaXRpb24ueSAtIHBsYXllclNpemUueSk7XHJcbiAgICAgICAgLy90aGlzLmRyYXdSZWN0KHRoaXMucGxheWVyLnNlcnZlclBvc2l0aW9uLngsIHRoaXMucGxheWVyLnNlcnZlclBvc2l0aW9uLnksIHBsYXllclNpemUueCAqIHRoaXMucGxheWVyLnNjYWxlLngsIHBsYXllclNpemUueSAqIHRoaXMucGxheWVyLnNjYWxlLnksIFwicmdiYSgyNTUsMCwwLDAuNSlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhLmVuZCgpO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlOiBUaGlzIGlzIGRlZmluZWQgaW4gdGhlIG1haW4gcGFnZS5cclxuICAgICAgICB3aW5kb3cuZnBzTWV0ZXIudGljaygpO1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Kb2luZWQoaWQ6IG51bWJlciwgbmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICB0aGlzLnBsYXllci5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMucGxheWVyLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucGxheWVyLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbk1lc3NhZ2UobXNnOiBJTWVzc2FnZSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYFJlY2VpdmVkIG1lc3NhZ2UgdHlwZSAke21zZy5tZXNzYWdlVHlwZX0gZnJvbSBzZXJ2ZXIuYCk7XHJcblxyXG4gICAgICAgIGlmIChtc2cubWVzc2FnZVR5cGUgPT09IE1lc3NhZ2VUeXBlLlN0YXRlVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1N0YXRlVXBkYXRlKG1zZyBhcyBTdGF0ZVVwZGF0ZU1lc3NhZ2UpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm1lc3NhZ2VUeXBlID09PSBNZXNzYWdlVHlwZS5QbGF5ZXJJbmZvKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVySW5mbyhtc2cgYXMgUGxheWVySW5mb01lc3NhZ2UpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm1lc3NhZ2VUeXBlID09PSBNZXNzYWdlVHlwZS5Kb2luQWNjZXB0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkTWFwKChtc2cgYXMgSm9pbkFjY2VwdGVkTWVzc2FnZSkubWFwSUQpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZE1hcChpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmU6IEF4aW9zIGlzIGxvYWRlZCBmcm9tIGEgQ0ROXHJcbiAgICAgICAgYXhpb3MuZ2V0KFwiL21hcHMvXCIgKyBpZCArIFwiLmpzb25cIilcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubWFwID0gbmV3IE1hcChyZXNwb25zZS5kYXRhLk5hbWUsIHJlc3BvbnNlLmRhdGEuV2lkdGgsIHJlc3BvbnNlLmRhdGEuSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHNlbGYubWFwLmxvYWREYXRhKHJlc3BvbnNlLmRhdGEuVGlsZXMpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3I6YW55KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzU3RhdGVVcGRhdGUoc3RhdGU6IFN0YXRlVXBkYXRlTWVzc2FnZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5yZWFkeSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHAgb2Ygc3RhdGUucGxheWVycykge1xyXG4gICAgICAgICAgICBpZiAocC5pZCA9PT0gdGhpcy5wbGF5ZXIuaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQgcGxheWVyLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJSZWNvbmNpbGlhdGlvbihwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3RoZXJQbGF5ZXIocCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXdpbmRQbGF5ZXIoaW5wdXQ6IFBsYXllcklucHV0TWVzc2FnZSkge1xyXG4gICAgICAgIHRoaXMucGxheWVyLmxhc3RKdW1wID0gaW5wdXQubGFzdEp1bXA7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIubGFzdERvd24gPSBpbnB1dC5sYXN0RG93bjtcclxuICAgICAgICB0aGlzLnBsYXllci5tb3ZlUmlnaHQgPSBpbnB1dC5tb3ZlUmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIubW92ZUxlZnQgPSBpbnB1dC5tb3ZlTGVmdDtcclxuICAgICAgICB0aGlzLnBsYXllci5tb3ZlRG93biA9IGlucHV0Lm1vdmVEb3duO1xyXG4gICAgICAgIHRoaXMucGxheWVyLmp1bXBpbmcgPSBpbnB1dC5qdW1waW5nO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnJ1bm5pbmcgPSBpbnB1dC5ydW5uaW5nO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnB1c2hlZFJpZ2h0V2FsbCA9IGlucHV0LnB1c2hlZFJpZ2h0V2FsbDtcclxuICAgICAgICB0aGlzLnBsYXllci5wdXNoZXNSaWdodFdhbGwgPSBpbnB1dC5wdXNoZXNSaWdodFdhbGw7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIucHVzaGVkTGVmdFdhbGwgPSBpbnB1dC5wdXNoZWRMZWZ0V2FsbDtcclxuICAgICAgICB0aGlzLnBsYXllci5wdXNoZXNMZWZ0V2FsbCA9IGlucHV0LnB1c2hlc0xlZnRXYWxsO1xyXG4gICAgICAgIHRoaXMucGxheWVyLndhc09uR3JvdW5kID0gaW5wdXQud2FzT25Hcm91bmQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIub25Hcm91bmQgPSBpbnB1dC5vbkdyb3VuZDtcclxuICAgICAgICB0aGlzLnBsYXllci53YXNBdENlaWxpbmcgPSBpbnB1dC53YXNBdENlaWxpbmc7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuYXRDZWlsaW5nID0gaW5wdXQuYXRDZWlsaW5nO1xyXG4gICAgICAgIHRoaXMucGxheWVyLm9uT25lV2F5UGxhdGZvcm0gPSBpbnB1dC5vbk9uZVdheVBsYXRmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VydmVyUmVjb25jaWxpYXRpb24obXNnOiBQb3NpdGlvbk1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLnBsYXllci5zZXJ2ZXJQb3NpdGlvbi54ID0gbXNnLnBvc2l0aW9uWDtcclxuICAgICAgICB0aGlzLnBsYXllci5zZXJ2ZXJQb3NpdGlvbi55ID0gbXNnLnBvc2l0aW9uWTtcclxuXHJcbiAgICAgICAgLy8gU2V0IG91ciBzdGF0ZSB0byBzZXJ2ZXIncyBkYXRhLlxyXG4gICAgICAgIHRoaXMucGxheWVyLnBvc2l0aW9uLnggPSBtc2cucG9zaXRpb25YO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnBvc2l0aW9uLnkgPSBtc2cucG9zaXRpb25ZO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSBtc2cudmVsb2NpdHlYO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnZlbG9jaXR5LnkgPSBtc2cudmVsb2NpdHlZO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgaW5wdXRzIGFscmVhZHkgcHJvY2Vzc2VkIGJ5IHRoZSBzZXJ2ZXIuXHJcbiAgICAgICAgd2hpbGUgKHRoaXMuaW5wdXRIaXN0b3J5Lmxlbmd0aCAmJiB0aGlzLmlucHV0SGlzdG9yeVswXS5zZXF1ZW5jZSA8PSBtc2cuc2VxdWVuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEhpc3Rvcnkuc2hpZnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlucHV0SGlzdG9yeS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gTm8gaW5wdXRzIHRvIHByb2Nlc3MuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5lcnJvcihcIk5vIGlucHV0cyB0byByZXBsYXkuICBUaGlzIHNob3VsZG4ndCBoYXBwZW4uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZXdpbmQgYmFjayB0byBmaXJzdCBpbnB1dCBub3QgcHJvY2Vzc2VkIGJ5IHRoZSBzZXJ2ZXIuXHJcbiAgICAgICAgdGhpcy5yZXdpbmRQbGF5ZXIodGhpcy5pbnB1dEhpc3RvcnlbMF0pO1xyXG5cclxuICAgICAgICAvLyBSZS1zaW11bGF0ZSB1bnByb2Nlc3NlZCBpbnB1dHMuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlucHV0SGlzdG9yeS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuaW5wdXRIaXN0b3J5W2ldO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5wbGF5ZXJVcGRhdGUoaW5wdXQuaW5wdXQsIDAuMDE2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQbGF5ZXJJbmZvKG1zZzogUGxheWVySW5mb01lc3NhZ2UpIHtcclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMub3RoZXJQbGF5ZXJzLmZpbHRlcigoZSwgaSkgPT4gZS5pZCA9PT0gbXNnLmlkKTtcclxuICAgICAgICBpZiAob3AubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIG9wWzBdLm5hbWUgPSBtc2cubmFtZTtcclxuICAgICAgICAgICAgb3BbMF0uY29sb3IgPSBtc2cuY29sb3I7XHJcbiAgICAgICAgICAgIG9wWzBdLnJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVPdGhlclBsYXllcihtc2c6IFBvc2l0aW9uTWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5vdGhlclBsYXllcnMuZmlsdGVyKChlLCBpKSA9PiBlLmlkID09PSBtc2cuaWQpO1xyXG4gICAgICAgIGlmIChvcC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gRXhpc3RpbmcgY2xpZW50XHJcbiAgICAgICAgICAgIG9wWzBdLnBvc2l0aW9uLnggPSBtc2cucG9zaXRpb25YO1xyXG4gICAgICAgICAgICBvcFswXS5wb3NpdGlvbi55ID0gbXNnLnBvc2l0aW9uWTtcclxuICAgICAgICAgICAgb3BbMF0ubGFzdFVwZGF0ZSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTmV3IGNsaWVudFxyXG4gICAgICAgICAgICB0aGlzLm5ldHdvcmtDbGllbnQuZ2V0UGxheWVySW5mbyhtc2cuaWQpO1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgRW50aXR5KHRoaXMsIG5ldyBWZWN0b3IobXNnLnBvc2l0aW9uWCwgbXNnLnBvc2l0aW9uWSksIG5ldyBWZWN0b3IoQ29uc3RhbnRzLnRpbGVTaXplICogMC41ICogMC44LCBDb25zdGFudHMudGlsZVNpemUgKiAwLjUgKiAxLjUpKTtcclxuICAgICAgICAgICAgZW50aXR5LmlkID0gbXNnLmlkO1xyXG4gICAgICAgICAgICB0aGlzLm90aGVyUGxheWVycy5wdXNoKGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFZlY3RvciBmcm9tIFwiLi9WZWN0b3JcIjtcclxuaW1wb3J0IEVuZ2luZSBmcm9tIFwiLi9FbmdpbmVcIjtcclxuXHJcbmNsYXNzIEFwcCB7XHJcbiAgICBwdWJsaWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHB1YmxpYyBlbmdpbmU6IEVuZ2luZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNJRDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJRCkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgRW5naW5lKHRoaXMuY2FudmFzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEFwcChcImdhbWVcIik7IiwiaW1wb3J0IFZlY3RvciBmcm9tIFwiLi9WZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBJRHJhd2FibGUge1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjtcclxuICAgIGRyYXdTaXplOiBWZWN0b3I7XHJcbn0iXX0=