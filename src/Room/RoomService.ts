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

export const hostileRoomObjects = new LazyMap<string, Cache<Array<AnyCreep | Structure>>>(name =>
    new Cache(() => {
        const room = Game.rooms[name]
        let result: Array<AnyCreep | Structure> = room.find(FIND_HOSTILE_CREEPS)
        result = result.concat(room.find<Structure>(FIND_HOSTILE_STRUCTURES))
        return result
    }));
