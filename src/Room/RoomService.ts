import { Cache } from "utils/Cache"
import { LazyMap } from "utils/LazyMap"

/**房間structure集合map */
export const roomStructures = new LazyMap<string, Cache<Array<AnyStructure>>>(
    name =>
        new Cache(() => {
            return Game.rooms[name].find(FIND_STRUCTURES)
        })
)

/**檢查是否有需要存能源的目標 */
export function findStructuresNotHostileAndNeedEnergy(room: Room) {
    return roomStructures
        .get(room.name)
        .value.filter(
            s =>
                (s as AnyOwnedStructure).my !== false &&
                (s as AnyStoreStructure).store !== undefined &&
                (s as AnyStoreStructure).store.getFreeCapacity(RESOURCE_ENERGY) > 0
        )
}

/**敵對物件集合Map */
export const hostileRoomObjects = new LazyMap<string, Cache<Array<Creep | AnyOwnedStructure>>>(
    name =>
        new Cache(() => {
            const room = Game.rooms[name]
            const hostileCreeps = room.find(FIND_HOSTILE_CREEPS)
            const hostileStructures = roomStructures
                .get(name)
                .value.filter(s => (s as AnyOwnedStructure).my === false) as AnyOwnedStructure[]
            return (hostileCreeps as Array<Creep | AnyOwnedStructure>).concat(hostileStructures)
        })
)

/**source邊緣數量Map */
export const sourceEdgeMaps = new LazyMap<string, Map<string, number>>(name => {
    const room = Game.rooms[name]
    const sources = room.find(FIND_SOURCES)
    const terrain = room.getTerrain()
    const map = new Map<string, number>()
    sources.forEach(source => {
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
        map.set(source.id, edges)
    })
    return map
})
