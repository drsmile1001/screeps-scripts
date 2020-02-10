import { logger } from "utils/Logger"

/**更新記憶 */
export function updateMemory() {
    for (const name in Game.spawns) {
        const spawn = Game.spawns[name]
        //找到資源並記錄
        const sources = spawn.room.find(FIND_SOURCES)
        const terrain = spawn.room.getTerrain()
        const sourceMemory: ILookup<SourceMemory> = {}
        sources.forEach(source => {
            const edges = getSourceEdges(source, terrain)
            sourceMemory[source.id] = {
                creepLimit: edges,
            }
        })
        spawn.room.memory.sources = sourceMemory
    }
}
/**取得source可用採集邊緣 */
function getSourceEdges(source: Source, terrain: RoomTerrain) {
    const minX = source.pos.x - 1
    const maxX = source.pos.x + 1
    const minY = source.pos.y - 1
    const maxY = source.pos.y + 1
    let edges = 0
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (x === 0 && y === 0) continue
            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) edges += 1
        }
    }
    return edges
}

/**清理記憶 */
export function cleanMemory() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
        }
    }
}
