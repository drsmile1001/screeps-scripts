import { Cache } from "utils/Cache"
import { LazyMap } from "utils/LazyMap"

/**檢查是否有需要存能源的目標 */
export function findMyStructureNeedEnergy(room: Room) {
    return room.find<StructureSpawn | StructureTower | StructureExtension>(FIND_MY_STRUCTURES, {
        filter: s => {
            return (
                (s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_TOWER) &&
                s.energy < s.energyCapacity
            )
        }
    })
}

export const hostileRoomObjects = new LazyMap<string, Cache<Array<AnyCreep | Structure>>>(
    name =>
        new Cache(() => {
            const room = Game.rooms[name]
            let result: Array<AnyCreep | Structure> = room.find(FIND_HOSTILE_CREEPS)
            result = result.concat(room.find<Structure>(FIND_HOSTILE_STRUCTURES))
            return result
        })
)

export const sourceEdgeMaps = new LazyMap<string, Map<string, number>>(name => {
    const room = Game.rooms[name]
    const sources = room.find(FIND_SOURCES)
    const terrain = room.getTerrain()
    const map = new Map<string, number>()
    sources.forEach(source => {
        const edges = getSourceEdges(source, terrain)
        map.set(source.id, edges)
    })
    return map
})

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
