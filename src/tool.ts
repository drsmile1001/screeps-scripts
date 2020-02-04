class Tool {
    FindMyStructureNeedEnergy(room: Room) {
        //檢查資料時間
        let needUpdateData =
            room.memory.myStructureIdNeedEnergyDataTime < Game.time ||
            room.memory.myStructureIdNeedEnergyDataTime === undefined
        if (needUpdateData) {
            room.memory.myStructureIdNeedEnergy = room
                .find(FIND_MY_STRUCTURES, {
                    filter: s => {
                        return (
                            (s.structureType == STRUCTURE_EXTENSION ||
                                s.structureType == STRUCTURE_SPAWN ||
                                s.structureType == STRUCTURE_TOWER) &&
                            s.energy < s.energyCapacity
                        )
                    }
                })
                .map(s => s.id)
        }
        return room.memory.myStructureIdNeedEnergy
    }
}

export const tool = new Tool()
