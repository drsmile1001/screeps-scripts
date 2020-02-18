export function atLoop(loop: number, shift: number = 0): boolean {
    return (Game.time - shift) % loop === 0
}

export function runAtLoop(loop: number, action: () => void, shift: number = 0) {
    if (!atLoop(loop, shift)) return
    action()
}
