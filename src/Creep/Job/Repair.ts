import { runAtLoop } from "utils/GameTick"
import { Cache } from "utils/Cache"
import { Lazy } from "utils/Lazy"
import { LazyMap } from "utils/LazyMap"
import { logger } from "utils/Logger"

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
            logger.error(`${creep.name} 在repairStructure時錯誤 ${result}`)
            return
    }
}

class PassiveDefenseStatus {
    defenseStructures: Lazy<Array<StructureWall | StructureRampart>>
    walls: Lazy<StructureWall[]>
    wallLevel: Lazy<number>
    ramparts: Lazy<StructureRampart[]>
    rampartLevel: Lazy<number>
    constructor(roomName: string) {
        const room = Game.rooms[roomName]
        this.defenseStructures = new Lazy(() =>
            room.find<StructureWall | StructureRampart>(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_WALL || (s.structureType === STRUCTURE_RAMPART && s.my)
            })
        )
        this.walls = new Lazy(
            () => <StructureWall[]>this.defenseStructures.value.filter(s => s.structureType === STRUCTURE_WALL)
        )

        this.wallLevel = new Lazy(() =>
            this.walls.value
                .map(wall => wall.hits)
                .reduce((previous, current) => Math.min(previous, current), Number.MAX_VALUE)
        )

        this.ramparts = new Lazy(
            () => <StructureRampart[]>this.defenseStructures.value.filter(s => s.structureType === STRUCTURE_RAMPART)
        )

        this.rampartLevel = new Lazy(() =>
            this.ramparts.value
                .map(wall => wall.hits)
                .reduce((previous, current) => Math.min(previous, current), Number.MAX_VALUE)
        )
    }
}

const passiveDefenseStatuses = new LazyMap<string, Cache<PassiveDefenseStatus>>(
    roomName => new Cache(() => new PassiveDefenseStatus(roomName))
)

function structureNeedRepair(structure: AnyStructure): boolean {
    if (
        structure.hits >= structure.hitsMax * 0.8 &&
        structure.structureType !== STRUCTURE_RAMPART &&
        structure.structureType !== STRUCTURE_WALL
    )
        return false
    if (structure.structureType === STRUCTURE_CONTROLLER) return false
    if (structure.structureType === STRUCTURE_ROAD) return true
    const status = passiveDefenseStatuses.get(structure.room.name).value

    const wallLevel = status.wallLevel.value + 5000
    const rampartLevel = status.rampartLevel.value
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
