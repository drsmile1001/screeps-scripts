import { runAtLoop } from "utils/GameTick"
import { roomStructures } from "Room/RoomService"
import { logger } from "utils/Logger"

export enum WithdrawEnergyResult {
    Ok,
    FullEnergy,
    NoWithdrawTarget
}
function withdrawEnergyTarget(creep: Creep, target: StructureContainer) {
    const result = creep.withdraw(target, RESOURCE_ENERGY)
    switch (result) {
        case ERR_NOT_IN_RANGE:
            runAtLoop(3, () => creep.say("🛒"), creep.ticksToLive)
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } })
            return
        case OK:
            return
        default:
            creep.say("❌")
            logger.error(`${creep.name} 在withdrawEnergyTarget時錯誤 ${result}`)
            return
    }
}

export function withdrawEnergy(creep: Creep): WithdrawEnergyResult {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return WithdrawEnergyResult.FullEnergy
    while (true) {
        if (creep.memory.withdrawEnergyTargetId) {
            const container = Game.getObjectById<StructureContainer>(creep.memory.withdrawEnergyTargetId)
            if (!container || container.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                delete creep.memory.withdrawEnergyTargetId
                continue
            } else {
                withdrawEnergyTarget(creep, container)
                return WithdrawEnergyResult.Ok
            }
        } else {
            const containers = roomStructures
                .get(creep.room.name)
                .value.filter(
                    s => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                ) as StructureContainer[]
            if (!containers.length) {
                return WithdrawEnergyResult.NoWithdrawTarget
            }
            const targetContainer = creep.pos.findClosestByRange(containers)!
            withdrawEnergyTarget(creep, targetContainer)
            return WithdrawEnergyResult.Ok
        }
    }
}
