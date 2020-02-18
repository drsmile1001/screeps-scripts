import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { logger } from "utils/Logger"

enum Job {
    getEnergy = "getEnergy",
    repair = "repair"
}

/**基礎升級角色執行器 */
export class Upgrader implements IRoleRuner {
    role = Role.Upgrader
    run(creep: Creep) {
        while (true) {
            switch (creep.memory.job) {
                case Job.getEnergy:
                    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                        creep.memory.job = Job.repair
                        continue
                    }
                    const spawns = creep.room.find(FIND_MY_STRUCTURES)
                    if (!spawns.length) {
                        creep.say("💤")
                        logger.log(`${creep.name} 找不到spawn`)
                        return
                    }
                    const withdrawResult = creep.withdraw(spawns[0], RESOURCE_ENERGY)
                    if (withdrawResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawns[0])
                    }
                    return
                case Job.repair:
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                        creep.memory.job = Job.getEnergy
                        continue
                    }

                    return
                default:
                    creep.memory.job = Job.repair
                    continue
            }
        }
    }
}
