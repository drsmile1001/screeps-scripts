import { RoleRunner } from "roleRuner/roleRunner"
import { harvestJob } from "job/HarvestJob";
import { IJobRunner } from "job/IJobRunner";
import { buildJob } from "job/BuildJob";
/**建築角色執行器 */
export class Builder extends RoleRunner {
    JobRunners: ILookup<IJobRunner> = {
        build: buildJob,
        harvest: harvestJob
    };
    Role = "builder";
    CheckJob(creep: Creep): string {
        switch (creep.memory.job) {
            case "build":
                if (creep.carry.energy === 0) {
                    creep.memory.job = "harvest"
                }
                break;
            case "harvest":
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.job = "build";
                }
                break;
            default:
                creep.memory.job = "harvest"
                break;
        }
        return creep.memory.job;
    }
}

