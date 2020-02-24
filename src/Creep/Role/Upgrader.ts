import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { harvest, HarvestResult } from "Creep/Job/Harvest"
import { logger } from "utils/Logger"
import { upgradeController, UpgradeControllerResult } from "Creep/Job/UpgradeController"
import { roomStructures } from "Room/RoomService"
import { withdrawEnergy, WithdrawEnergyResult } from "Creep/Job/WithdrawEnergy"

enum Job {
    WithdrawEnergy = "withdrawEnergy",
    harvest = "harvest",
    upgradeController = "upgradeController"
}

/**基礎升級角色執行器 */
export class Upgrader implements IRoleRuner {
    role = Role.Upgrader
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
                            creep.memory.job = Job.upgradeController
                            continue
                        case WithdrawEnergyResult.NoWithdrawTarget:
                            creep.memory.job = Job.harvest
                            continue
                        default:
                            logger.error(`未知的withdrawEnergyResult ${withdrawEnergyResult}`)
                            return
                    }
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
                            creep.memory.job = Job.WithdrawEnergy
                            continue
                        case UpgradeControllerResult.NoTarget:
                            logger.error(`creep${creep.name} 無有效目標`)
                            return
                        default:
                            logger.error(`未知UpgradeControllerResult ${upgradeControllerResult}`)
                            return
                    }
                default:
                    creep.memory.job = Job.upgradeController
                    continue
            }
        } while (true)
    }
}
