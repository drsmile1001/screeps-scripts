import { logger } from "utils/Logger"
import { runAtLoop, atLoop } from "utils/GameTick"
import { Cache } from "utils/Cache"

export enum RepairResult {
    Ok,
    NoEnergy,
    NoTarget,
    Done
}

function repairStructure(creep: Creep, target: Structure) {
    const result = creep.repair(target)
    switch (result) {
        case ERR_NOT_IN_RANGE:
            runAtLoop(3, () => creep.say("🔧"), creep.ticksToLive)
            creep.moveTo(target, { visualizePathStyle: { stroke: "#aaaaaa" } })
            return
        case OK:
            return
        default:
            creep.say("❌")
            console.log(`${creep.name} 在repairStructure時錯誤 ${result}`)
            return
    }
}

let roomWeekestWall: ILookup<Cache<number>> = {}

function getRoomWeekestWall(room: Room): number {
    if (roomWeekestWall[room.name]) return roomWeekestWall[room.name].value
    roomWeekestWall[room.name] = new Cache(() => {
        return room
            .find(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_WALL
            })
            .map(wall => wall.hits)
            .reduce((min, next) => Math.min(min, next), Number.MAX_VALUE)
    })
    return roomWeekestWall[room.name].value
}

let roomWeekestRampart: ILookup<Cache<number>> = {}

function getRoomWeekestRampart(room: Room): number {
    if (roomWeekestRampart[room.name]) return roomWeekestRampart[room.name].value
    roomWeekestRampart[room.name] = new Cache(() => {
        return room
            .find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_RAMPART
            })
            .map(wall => wall.hits)
            .reduce((min, next) => Math.min(min, next), Number.MAX_VALUE)
    })
    return roomWeekestRampart[room.name].value
}

function structureNeedRepair(structure: AnyStructure): boolean {
    if (
        structure.hits >= structure.hitsMax * 0.8 &&
        structure.structureType !== STRUCTURE_RAMPART &&
        structure.structureType !== STRUCTURE_WALL
    )
        return false
    if (structure.structureType === STRUCTURE_CONTROLLER) return false
    if (structure.structureType === STRUCTURE_ROAD) return true

    const wallLevel = getRoomWeekestWall(structure.room) + 5000
    const rampartLevel = getRoomWeekestRampart(structure.room)
    const repairWallThenRampart = wallLevel < rampartLevel * 30
    if (structure.structureType === STRUCTURE_WALL) return structure.hits < wallLevel && repairWallThenRampart
    if (structure.structureType === STRUCTURE_RAMPART) return structure.hits < rampartLevel && !repairWallThenRampart
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
            if (!structures.length) return RepairResult.NoTarget
            let targets = structures.filter(
                s => (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && s.hits < 5000
            )
            if (!targets.length)
                targets = structures.filter(
                    s => s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
                )
            if (!targets.length) targets = structures
            const target = creep.pos.findClosestByRange(targets)!
            creep.memory.repairTargetId = target.id
            repairStructure(creep, target)
            return RepairResult.Ok
        }
    }
}
