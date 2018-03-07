import { RoleRunner } from "./roleRunner";
import { IJobRunner } from "job/IJobRunner";
import { harvestJob } from "job/HarvestJob";
import { upgradJob } from "job/UpgradJob";

/**升級角色執行器 */
export class Upgrader extends RoleRunner {
    JobRunners: ILookup<IJobRunner>={
        harvest: harvestJob,
        upgrad:upgradJob
    };
    Role: string = "upgrader";
    CheckJob(creep: Creep): string {
        switch (creep.memory.job) {
            case "upgrad":
                if (creep.carry.energy === 0) {
                    creep.memory.job = "harvest"
                }
                break;
            case "harvest":
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.job = "upgrad";
                }
                break;
            default:
                creep.memory.job = "harvest"
                break;
        }
        return creep.memory.job;
    }
}
