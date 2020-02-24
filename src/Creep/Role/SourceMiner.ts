import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { logger } from "utils/Logger"
import { CreepRegisterMap } from "utils/RegisterMap"
import { sourceEdgeMaps, roomStructures } from "Room/RoomService"
import { runAtLoop } from "utils/GameTick"

enum Job {
    Mine = "mine",
    Store = "store"
}

/**能源礦工角色執行器 */
export class SourceMiner implements IRoleRuner {
    role = Role.SourceMiner
    run(creep: Creep) {
        while (true) {
            switch (creep.memory.job) {
                case Job.Mine:
                    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                        creep.memory.job = Job.Store
                        continue
                    }
                    if (!creep.memory.harvestSourceId) {
                        const sourceCreeps = new CreepRegisterMap(memory => memory.harvestSourceId)
                        const sourceEdgeMap = sourceEdgeMaps.get(creep.room.name)
                        const sources = Array.from(sourceEdgeMap)
                            .filter(([sourceId, limit]) => sourceCreeps.get(sourceId).length < limit)
                            .map(([sourceId]) => Game.getObjectById<Source>(sourceId)!)
                            .filter(
                                source =>
                                    !sourceCreeps
                                        .get(source.id)
                                        .find(creepId => Game.creeps[creepId].memory.role === Role.SourceMiner)
                            )
                        if (sources.length) {
                            creep.say("❌")
                            logger.error(`creep ${creep.name} 找不到可用的source`)
                            return
                        }
                        const source = creep.pos.findClosestByRange(sources)!
                        creep.memory.harvestSourceId = source.id
                        this.harvestSource(creep, source)
                        return
                    }
                    const source = Game.getObjectById<Source>(creep.memory.harvestSourceId)!
                    this.harvestSource(creep, source)
                    break
                case Job.Store:
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                        creep.memory.job = Job.Mine
                        continue
                    }
                    if (!creep.memory.storeEnergyContainerId) {
                        const containers = roomStructures
                            .get(creep.room.name)
                            .value.filter(s => s.structureType === STRUCTURE_CONTAINER) as StructureContainer[]
                        if (!containers.length) {
                            creep.say("❌")
                            logger.error(`creep ${creep.name} 找不到可用的container`)
                            return
                        }
                        const containersInRange = creep.pos.findInRange(containers, 1)
                        if (!containersInRange.length) {
                            creep.say("❌")
                            logger.error(`creep ${creep.name} 找不到在範圍內可用的container`)
                            return
                        }
                        const targetContainer = containersInRange[0]
                        creep.memory.storeEnergyContainerId = targetContainer.id
                        this.storeEnergy(creep, targetContainer)
                        return
                    }
                    const targetContainer = Game.getObjectById<StructureContainer>(creep.memory.storeEnergyContainerId)!
                    this.storeEnergy(creep, targetContainer)
                    return
                default:
                    creep.memory.job = Job.Mine
                    continue
            }
        }
    }
    harvestSource(creep: Creep, source: Source) {
        if (!source?.energy) {
            creep.say("💤")
            return
        }
        const result = creep.harvest(source)
        switch (result) {
            case ERR_NOT_IN_RANGE:
                runAtLoop(3, () => creep.say("⛏️"), creep.ticksToLive)
                creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } })
                return
            case OK:
                return
            default:
                creep.say("❌")
                logger.error(`${creep.name} 在採集資源時錯誤 ${result}`)
                return
        }
    }
    storeEnergy(creep: Creep, container: StructureContainer) {
        const result = creep.transfer(container, RESOURCE_ENERGY)
        switch (result) {
            case ERR_NOT_IN_RANGE:
                runAtLoop(3, () => creep.say("⛏️"), creep.ticksToLive)
                creep.moveTo(container, { visualizePathStyle: { stroke: "#ffaa00" } })
                return
            case OK:
                return
            case ERR_FULL:
                creep.say("💤")
                return
            default:
                creep.say("❌")
                logger.error(`${creep.name} 存放資源時發生錯誤 ${result}`)
                return
        }
    }
}
