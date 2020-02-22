import { findMyStructureNeedEnergy } from "Room/RoomService"
import { runAtLoop } from "utils/GameTick"
import { logger } from "utils/Logger"

export enum TransferEnergyResult {
    Ok,
    NoEnergy,
    NoTarget
}

function transferEnergy(creep: Creep, target: AnyCreep | Structure) {
    const result = creep.transfer(target, RESOURCE_ENERGY)
    switch (result) {
        case ERR_NOT_IN_RANGE:
            runAtLoop(3, () => creep.say("🔋"), creep.ticksToLive)
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } })
            return
        case OK:
            return
        default:
            creep.say("❌")
            logger.error(`${creep.name} transferEnergy時錯誤 ${result}`)
            return
    }
}

export function transferEnergyToMyStructures(creep: Creep): TransferEnergyResult {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return TransferEnergyResult.NoEnergy
    while (true) {
        if (creep.memory.transferEnergyTargetId) {
            const targetStructure = Game.getObjectById<StructureSpawn | StructureTower | StructureExtension>(
                creep.memory.transferEnergyTargetId
            )
            if (!targetStructure || !targetStructure.store.getFreeCapacity(RESOURCE_ENERGY)) {
                delete creep.memory.transferEnergyTargetId
                continue
            } else {
                transferEnergy(creep, targetStructure)
                return TransferEnergyResult.Ok
            }
        } else {
            const structures = findMyStructureNeedEnergy(creep.room)
            if (structures.length) {
                creep.memory.transferEnergyTargetId = structures[0].id
                transferEnergy(creep, structures[0])
                return TransferEnergyResult.Ok
            } else return TransferEnergyResult.NoTarget
        }
    }
}
