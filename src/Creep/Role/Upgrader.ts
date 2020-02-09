import { IRoleRuner } from "./IRoleRuner"
import { logger } from "utils/Logger"
import { Role } from "Creep/Role"

enum Job {
    harvest = "harvest",
    upgradeController = "upgradeController"
}

/**基礎升級角色執行器 */
export class Upgrader implements IRoleRuner {
    role = Role.Upgrader
    run(creep: Creep) {
        const job = this.getJob(creep)
        creep.memory.job = job
        this[job](creep)
    }

    getJob(creep: Creep): Job {
        switch (creep.memory.job) {
            case Job.harvest:
                if (creep.carry.energy === creep.carryCapacity) return Job.upgradeController
                break
            case Job.upgradeController:
                if (creep.carry.energy === 0) return Job.harvest
                break
            default:
                return Job.harvest
        }
        return creep.memory.job!
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

    upgradeController(creep: Creep) {
        creep.say("🔱")
        if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } })
        }
    }
}
