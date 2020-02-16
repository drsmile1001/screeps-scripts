import { findMyStructureNeedEnergy } from "Room/RoomService"

export enum TransferEnergyResult {
    Ok,
    NoEnergy,
    NoTarget
}

function transferEnergy(creep: Creep, target: AnyCreep | Structure) {
    creep.say("🔋")
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } })
    }
}

export function transferEnergyToMyStructures(creep: Creep): TransferEnergyResult {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return TransferEnergyResult.NoEnergy
    while (true) {
        if (creep.memory.transferEnergyTargetId) {
            let targetStructure = Game.getObjectById<StructureSpawn | StructureTower | StructureExtension>(creep.memory.transferEnergyTargetId)
            if (!targetStructure || !targetStructure.store.getFreeCapacity(RESOURCE_ENERGY)) {
                delete creep.memory.transferEnergyTargetId
                continue
            }
            else {
                transferEnergy(creep, targetStructure)
                return TransferEnergyResult.Ok
            }
        }
        else {
            const structures = findMyStructureNeedEnergy(creep.room)
            if (structures.length) {
                creep.memory.transferEnergyTargetId = structures[0].id
                transferEnergy(creep, structures[0])
                return TransferEnergyResult.Ok
            }
            else return TransferEnergyResult.NoTarget
        }
    }
}
