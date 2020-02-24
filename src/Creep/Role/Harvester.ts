import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { transferEnergyToMyStructures, TransferEnergyResult } from "Creep/Job/TransferEnergy"
import { logger } from "utils/Logger"
import { harvest, HarvestResult } from "Creep/Job/Harvest"
import { build, BuildResult } from "Creep/Job/Build"
import { repair, RepairResult } from "Creep/Job/Repair"
import { withdrawEnergy, WithdrawEnergyResult } from "Creep/Job/WithdrawEnergy"

enum Job {
    WithdrawEnergy = "withdrawEnergy",
    Harvest = "harvest",
    TransferEnergy = "transferEnergy",
    Repair = "repair",
    Build = "build"
}

/**採集者角色執行器 */
export class Harvester implements IRoleRuner {
    role = Role.Harvester
    run(creep: Creep) {
        do {
            switch (creep.memory.job) {
                case Job.WithdrawEnergy:
                    const withdrawEnergyResult = withdrawEnergy(creep)
                    switch (withdrawEnergyResult) {
                        case WithdrawEnergyResult.Ok:
                            return
                        case WithdrawEnergyResult.FullEnergy:
                            delete creep.memory.withdrawEnergyTargetId
                            creep.memory.job = Job.Build
                            continue
                        case WithdrawEnergyResult.NoWithdrawTarget:
                            creep.memory.job = Job.Harvest
                            continue
                        default:
                            logger.error(`未知的withdrawEnergyResult ${withdrawEnergyResult}`)
                            return
                    }
                case Job.Harvest:
                    const harvestResult = harvest(creep)
                    switch (harvestResult) {
                        case HarvestResult.Ok:
                            return
                        case HarvestResult.FullEnergy:
                            delete creep.memory.harvestSourceId
                            creep.memory.job = Job.TransferEnergy
                            continue
                        case HarvestResult.NoSource:
                            creep.say("💤")
                            return
                        default:
                            logger.error(`未知HarvestResult ${harvestResult}`)
                            return
                    }
                case Job.TransferEnergy:
                    const transferEnergyToMyStructuresResult = transferEnergyToMyStructures(creep)
                    switch (transferEnergyToMyStructuresResult) {
                        case TransferEnergyResult.Ok:
                            return
                        case TransferEnergyResult.NoEnergy:
                            //缺乏能源轉移到採集任務
                            delete creep.memory.transferEnergyTargetId
                            creep.memory.job = Job.WithdrawEnergy
                            continue
                        case TransferEnergyResult.NoTarget:
                            //沒有能源轉移對象，改去維修
                            creep.memory.job = Job.Build
                            continue
                        default:
                            logger.error(`未知TransferEnergyResult ${transferEnergyToMyStructuresResult}`)
                            return
                    }
                case Job.Repair:
                    const repairResult = repair(creep, true)
                    switch (repairResult) {
                        case RepairResult.Ok:
                            return
                        case RepairResult.NoEnergy:
                            //缺乏能源轉移到採集任務
                            creep.memory.job = Job.Harvest
                            continue
                        case RepairResult.Done:
                            //維修一次後，改去傳送能源
                            creep.memory.job = Job.TransferEnergy
                            continue
                        case RepairResult.NoTarget:
                            creep.say("💤")
                            creep.memory.job = Job.TransferEnergy
                            return
                        default:
                            logger.error(`未知RepairResult ${repairResult}`)
                            return
                    }
                case Job.Build:
                    const buildResult = build(creep, true)
                    switch (buildResult) {
                        case BuildResult.Ok:
                            return
                        case BuildResult.NoEnergy:
                            //缺乏能源轉移到採集任務
                            creep.memory.job = Job.Harvest
                            continue
                        case BuildResult.Done:
                            creep.memory.job = Job.TransferEnergy
                            continue
                        case BuildResult.NoTarget:
                            creep.memory.job = Job.Repair
                            continue
                        default:
                            logger.error(`未知BuildResult ${buildResult}`)
                            return
                    }
                default:
                    creep.memory.job = Job.WithdrawEnergy
                    continue
            }
        } while (true)
    }
}
