export function atLoop(loop: number): boolean {
    return Game.time % loop === 0
}

export function runAtLoop(loop: number, action: () => void) {
    if (!atLoop(loop)) return
    action()
}
