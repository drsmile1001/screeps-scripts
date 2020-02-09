/**檢查是否有需要存能源的目標 */
export function findMyStructureNeedEnergy(room: Room) {
    return room.find(FIND_MY_STRUCTURES, {
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
