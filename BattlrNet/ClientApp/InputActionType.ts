export const enum InputActionType {
    None    = 0,
    Right   = 1 << 1,
    Left    = 1 << 2,
    Up      = 1 << 3,
    Down    = 1 << 4,
    Jump    = 1 << 5,
    Run     = 1 << 6,
    Action1 = 1 << 7,
    Action2 = 1 << 8,
    Action3 = 1 << 9,
    Select  = 1 << 10,
    Cancel  = 1 << 11
}