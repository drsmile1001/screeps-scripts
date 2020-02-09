/**更新記憶 */
export function updateMemory() {
    for (const name in Game.spawns) {
        if (Game.spawns.hasOwnProperty(name)) {
            const spawn = Game.spawns[name]
            //找到資源並記錄
            const sources = spawn.room.find(FIND_SOURCES)
            const roomMemory = spawn.room.memory
            roomMemory.sources = sources.map(source => ({
                id: source.id
            }))
        }
    }
}

/**清理記憶 */
export function cleanMemory() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
        }
    }
}
