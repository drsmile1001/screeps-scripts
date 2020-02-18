import { Cache } from "utils/Cache"

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

const hostileRoomObjects: ILookup<Cache<Array<AnyCreep | Structure>>> = {}

export function getHostileRoomObject(room: Room) {
    if (!hostileRoomObjects[room.name]) {
        hostileRoomObjects[room.name] = new Cache(() => {
            let result: Array<AnyCreep | Structure> = room.find(FIND_HOSTILE_CREEPS)
            result = result.concat(room.find<Structure>(FIND_HOSTILE_STRUCTURES))
            return result
        })
    }
    return hostileRoomObjects[room.name].value
}
