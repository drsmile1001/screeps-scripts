import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { harvest, HarvestResult } from "Creep/Job/Harvest";
import { logger } from "utils/Logger";
import { upgradeController, UpgradeControllerResult } from "Creep/Job/UpgradeController";

enum Job {
    harvest = "harvest",
    upgradeController = "upgradeController"
}

/**基礎升級角色執行器 */
export class Upgrader implements IRoleRuner {
    role = Role.Upgrader
    run(creep: Creep) {
        do {
            switch (creep.memory.job) {
                case Job.harvest:
                    const harvestResult = harvest(creep)
                    switch (harvestResult) {
                        case HarvestResult.Ok:
                            return
                        case HarvestResult.FullEnergy:
                            delete creep.memory.harvestSourceId
                            creep.memory.job = Job.upgradeController
                            continue
                        case HarvestResult.NoSource:
                            creep.say("💤")
                            return
                        default:
                            logger.error(`未知HarvestResult ${harvestResult}`)
                            return
                    }
                case Job.upgradeController:
                    const upgradeControllerResult = upgradeController(creep)
                    switch (upgradeControllerResult) {
                        case UpgradeControllerResult.Ok:
                            return
                        case UpgradeControllerResult.NoEnergy:
                            //缺乏能源轉移到採集任務
                            creep.memory.job = Job.harvest
                            continue
                        default:
                            logger.error(`未知UpgradeControllerResult ${upgradeControllerResult}`)
                            return
                    }
                default:
                    creep.memory.job = Job.upgradeController
                    continue
            }
        } while (true);
    }
}
