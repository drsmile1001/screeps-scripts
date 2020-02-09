import { IRoleRuner } from "./IRoleRuner"
import { logger } from "utils/Logger"
import { findMyStructureNeedEnergy } from "Room/RoomService"
import { Role } from "Creep/Role"

enum Job {
    harvest = "harvest",
    transferEnergy = "transferEnergy"
}

/**採集者角色執行器 */
export class Harvester implements IRoleRuner {
    role = Role.Harvester
    run(creep: Creep) {
        const job = this.getJob(creep)
        creep.memory.job = job
        this[job](creep)
    }

    getJob(creep: Creep): Job {
        switch (creep.memory.job) {
            case Job.harvest:
                if (creep.carry.energy == creep.carryCapacity) return Job.transferEnergy
                break
            case Job.transferEnergy:
                if (creep.carry.energy === 0) return Job.harvest
                break
            default:
                return Job.harvest
        }
        return creep.memory.job
    }

    harvest(creep: Creep) {
        const sourcesData = creep.room.memory.sources
        if (!sourcesData || !sourcesData.length) {
            creep.say("❓")
            logger.warn(`creep${creep.name} 在 room${creep.room.name} 找不到可用的source`)
            return
        }
        const sourceData = sourcesData[0]
        const source = Game.getObjectById<Source>(sourceData.id)
        if (!source) {
            creep.say("❓")
            logger.warn(`room${creep.room.name} 記錄的 source${sourceData.id} 不正確`)
            return
        }
        creep.say("⛏️")
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } })
        }
    }

    transferEnergy(creep: Creep) {
        //檢查要存能源的目標
        let structure: Structure | null = null
        if (creep.memory.transferEnergyTargetId) {
            const structureInMemory = Game.getObjectById<Structure>(creep.memory.transferEnergyTargetId)
            if (structureInMemory) structure = structureInMemory
            else creep.memory.transferEnergyTargetId = undefined
        }

        if (!structure) {
            const structures = findMyStructureNeedEnergy(creep.room)
            if (!structures.length) {
                creep.say("💤")
                return
            }
            structure = structures[0]
            creep.memory.transferEnergyTargetId = structure.id
        }
        creep.say("🔋")
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, { visualizePathStyle: { stroke: "#ffffff" } })
        }
    }
}
