import { logger } from "utils/Logger"

export enum RepairResult {
    Ok,
    NoEnergy,
    NoTarget,
    Done
}

function repairStructure(creep: Creep, target: Structure) {
    creep.say("🔧")
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ddffdd" } })
    }
}

function structureNeedRepair(structure: AnyStructure): boolean {
    if (structure.hits >= structure.hitsMax) return false
    if (structure.structureType === STRUCTURE_CONTROLLER) return false
    if (structure.structureType === STRUCTURE_ROAD) return true
    let s = structure as OwnedStructure
    return s?.my ?? false
}

export function repair(creep: Creep, once: boolean = false): RepairResult {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return RepairResult.NoEnergy
    while (true) {
        if (creep.memory.repairTargetId) {
            const structure = Game.getObjectById<AnyOwnedStructure>(creep.memory.repairTargetId)

            if (!structure || !structureNeedRepair(structure)) {
                delete creep.memory.repairTargetId
                if (once) return RepairResult.Done
                else continue
            } else {
                repairStructure(creep, structure)
                return RepairResult.Ok
            }
        } else {
            const structures = creep.room.find(FIND_STRUCTURES, {
                filter: structure => structureNeedRepair(structure)
            })
            if (structures.length) {
                creep.memory.repairTargetId = structures[0].id
                repairStructure(creep, structures[0])
                return RepairResult.Ok
            } else return RepairResult.NoTarget
        }
    }
}
