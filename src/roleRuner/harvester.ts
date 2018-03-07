import { RoleRunner } from "roleRuner/roleRunner";
import { harvestJob } from "job/HarvestJob";
import { IJobRunner } from "job/IJobRunner";
import { tool } from "tool";
import { storeEnergyJob } from "job/StoreEnergyJob";
import { sleepJob } from "job/SleepJob";

/**採集角色執行器 */
export class Harvester extends RoleRunner {
    JobRunners: ILookup<IJobRunner> = {
        harvest: harvestJob,
        storeEnergy: storeEnergyJob,
        sleep: sleepJob,
    };
    Role: string = "harvester";
    CheckJob(creep: Creep): string {
        switch (creep.memory.job) {
            case "storeEnergy":
                if (creep.carry.energy === 0) {
                    creep.memory.job = "harvest"
                }
                break;
            case "harvest":
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.job = this.CheckStoreEnergyTarget(creep)
                        ? "storeEnergy"
                        : "sleep";
                }
                break;
            case "sleep":
                let targets = tool.FindMyStructureNeedEnergy(creep.room);
                if (this.CheckStoreEnergyTarget(creep)) {
                    creep.memory.job = "storeEnergy";
                }
                break;
            default:
                creep.memory.job = "harvest"
                break;
        }
        return creep.memory.job;
    };
    /**檢查是否有需要存能源的目標 */
    CheckStoreEnergyTarget(creep: Creep): boolean {
        let targets = tool.FindMyStructureNeedEnergy(creep.room);
        if (targets.length) {
            creep.memory.targetId = targets[0];
            return true;
        } else {
            creep.memory.targetId = null
            return false;
        }
    }
}
