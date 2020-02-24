import { IRoleRuner } from "Creep/Role/IRoleRuner"
import { Harvester } from "Creep/Role/Harvester"
import { logger } from "utils/Logger"
import { Upgrader } from "./Role/Upgrader"
import { Role } from "Creep/Role"
import { RoomGuard } from "./Role/RoomGuard"
import { SourceMiner } from "./Role/SourceMiner"

/**註冊的執行器 */
const roleRunnerMap = new Map<Role, IRoleRuner>()
const roleRunners: IRoleRuner[] = [new Harvester(), new Upgrader(), new RoomGuard(), new SourceMiner()]
roleRunners.forEach(roleRunner => {
    roleRunnerMap.set(roleRunner.role, roleRunner)
})

/**執行Creep */
function runCreep(creep: Creep) {
    const role = creep.memory.role
    const roleRunner = roleRunnerMap.get(creep.memory.role)
    if (roleRunner) roleRunner.run(creep)
    else logger.error(`找不到${creep.name}的${role}對應執行器`)
}

/**執行所有Creep */
export function runAllCreeps() {
    for (const name in Game.creeps) {
        try {
            const creep = Game.creeps[name]
            if (creep.spawning) continue
            runCreep(creep)
        } catch (error) {
            logger.error(error)
        }
    }
}
