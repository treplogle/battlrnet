import { InputActionType } from "./InputActionType";
import Vector from "./Vector";
import Constants from "./Constants";

export default class Utilities {

    // =========================================
    // Enum flag utilities
    public static FlagTest(currentValue: number, flag: number) {
        return currentValue & flag;
    }

    public static FlagSet(currentValue: number, flag: number) {
        return currentValue | flag;
    }

    public static FlagUnset(currentValue: number, flag: number) {
        return currentValue & ~flag;
    }

    // =========================================
    // Input
    public static readonly AllInputActions = [
        InputActionType.Right,
        InputActionType.Left,
        InputActionType.Up,
        InputActionType.Down,
        InputActionType.Jump,
        InputActionType.Run,
        InputActionType.Action1,
        InputActionType.Action2,
        InputActionType.Action3,
        InputActionType.Select,
        InputActionType.Cancel
    ];

    // =========================================
    // Rounding (better network reconciliation)
    public static roundNumber(val: number) {
        return parseFloat(val.toFixed(Constants.networkPrecision));
    }

    public static roundVector(val: Vector, out?: Vector) {
        if (!out) out = new Vector();
        out.x = Utilities.roundNumber(val.x);
        out.y = Utilities.roundNumber(val.y);
        return out;
    }

    // =========================================
    // Colors

    public static randomColor(min: number, max: number) {
        const range = max - min;

        const r = Math.round(Math.random() * range + min);
        const g = Math.round(Math.random() * range + min);
        const b = Math.round(Math.random() * range + min);

        return `rgb(${r},${g},${b})`;
    }
}