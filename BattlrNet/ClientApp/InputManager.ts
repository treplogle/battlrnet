class InputState {
    public pressed = false;
    public newState = false;
    public stateTime = 0;

    constructor(public keys: Array<number>) { }
}

export default class InputManager {

    private keyStates: Array<boolean> = [];
    private inputActionStates: Array<InputState> = [];

    constructor() {
        const self = this;
        document.addEventListener("keydown", function (ev) { return self.onKeyEvent(ev, ev.keyCode, true); }, false);
        document.addEventListener("keyup", function (ev) { return self.onKeyEvent(ev, ev.keyCode, false); }, false);
    }

    private onKeyEvent(event: KeyboardEvent, key: number, down: boolean) {
        this.keyStates[key] = down;
        return false;
    }

    public removeInputAction(id: number) {
        if (this.inputActionStates.length >= id || typeof (this.inputActionStates[id]) === "undefined") {
            this.inputActionStates[id] = undefined;
        }
    }

    public addInputAction(id: number, keys: Array<number>) {
        if (this.inputActionStates.length >= id || this.inputActionStates[id] === undefined || this.inputActionStates[id] === null) {
            const thisKeys = [];
            for (let i = 0; i < keys.length; i++) {
                thisKeys.push(keys[i]);
            }
            this.inputActionStates[id] = new InputState(thisKeys);
        }
    }

    public update(elapsed: number) {
        let input: InputState,
            key: number,
            anyDown: boolean;

        for (const i in this.inputActionStates) {
            input = this.inputActionStates[i];
            anyDown = false;
            for (const k in input.keys) {
                key = input.keys[k];
                if (this.keyStates[key]) {
                    anyDown = true;
                }
            }

            if (anyDown === input.pressed) {
                // Existing state
                input.stateTime += elapsed;
                input.newState = false;
            } else {
                // New state
                input.stateTime = 0;
                input.newState = true;
                input.pressed = anyDown;
            }
        }
    }

    /** Returns true while the action is held down. */
    public getAction(id: number) {
        return this.inputActionStates[id].pressed;
    }

    /** Returns true during the frame the action was pressed. */
    public getActionDown(id: number) {
        const state = this.inputActionStates[id];
        return state.pressed && state.newState;
    }

    /** Returns true during the frame the action was released. */
    public getActionUp(id: number) {
        const state = this.inputActionStates[id];
        return !state.pressed && state.newState;
    }

    public getInputState(id: number) {
        return this.inputActionStates[id];
    }
}
