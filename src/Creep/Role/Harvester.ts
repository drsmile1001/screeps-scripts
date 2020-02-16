import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { transferEnergyToMyStructures, TransferEnergyResult } from "Creep/Job/TransferEnergy"
import { logger } from "utils/Logger"
import { harvest, HarvestResult } from "Creep/Job/Harvest"
import { build, BuildResult } from "Creep/Job/Build"

enum Job {
    harvest = "harvest",
    transferEnergy = "transferEnergy",
    build = "build"
}

/**採集者角色執行器 */
export class Harvester implements IRoleRuner {
    role = Role.Harvester
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
                            creep.memory.job = Job.transferEnergy
                            continue
                        case HarvestResult.NoSource:
                            creep.say("💤")
                            return
                        default:
                            logger.error(`未知HarvestResult ${harvestResult}`)
                            return
                    }
                case Job.transferEnergy:
                    const transferEnergyToMyStructuresResult = transferEnergyToMyStructures(creep)
                    switch (transferEnergyToMyStructuresResult) {
                        case TransferEnergyResult.Ok:
                            return
                        case TransferEnergyResult.NoEnergy:
                            //缺乏能源轉移到採集任務
                            delete creep.memory.transferEnergyTargetId
                            creep.memory.job = Job.harvest
                            continue
                        case TransferEnergyResult.NoTarget:
                            //無有效目標改去建築
                            creep.memory.job = Job.build
                            continue
                        default:
                            logger.error(`未知TransferEnergyResult ${transferEnergyToMyStructuresResult}`)
                            return
                    }
                case Job.build:
                    const buildResult = build(creep, true)
                    switch (buildResult) {
                        case BuildResult.Ok:
                            return
                        case BuildResult.NoEnergy:
                            //缺乏能源轉移到採集任務
                            creep.memory.job = Job.harvest
                            continue
                        case BuildResult.Done:
                            //建築一次後，改去傳送能源
                            creep.memory.job = Job.transferEnergy
                            continue
                        case BuildResult.NoTarget:
                            creep.say("💤")
                            creep.memory.job = Job.transferEnergy
                            return
                        default:
                            logger.error(`未知BuildResult ${buildResult}`)
                            return
                    }
                default:
                    creep.memory.job = Job.transferEnergy
                    continue
            }
        } while (true);
    }
}
