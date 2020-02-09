import { RoleRunner } from "Creep/roleRuner/roleRunner"
import { harvestJob } from "Creep/Job/HarvestJob"
import { IJobRunner } from "Creep/Job/IJobRunner"
import { buildJob } from "Creep/Job/BuildJob"
/**建築角色執行器 */
export class Builder extends RoleRunner {
    JobRunners: ILookup<IJobRunner> = {
        build: buildJob,
        harvest: harvestJob
    }
    Name = "builder"
    CheckJob(creep: Creep): string {
        switch (creep.memory.job) {
            case "build":
                if (creep.carry.energy === 0) {
                    creep.memory.job = "harvest"
                }
                break
            case "harvest":
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.job = "build"
                }
                break
            default:
                creep.memory.job = "harvest"
                break
        }
        return creep.memory.job
    }
}
