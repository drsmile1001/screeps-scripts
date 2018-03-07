import { RoleRunner } from "roleRuner/roleRunner"
import { HarvestJob } from "job/HarvestJob";
import { IJobRunner } from "job/IJobRunner";
/**建築角色執行器 */
export class Builder extends RoleRunner {
    JobRunners: ILookup<IJobRunner> = {
        build: new BuildJob(),
        harvest: new HarvestJob()
    };
    Role = "builder";
    CheckJob(creep: Creep): string {
        switch (creep.memory.role) {
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

/**建造工作 */
class BuildJob implements IJobRunner {
    Job: string = "build";
    SayWord: string = "🚧";
    PathColor: string = "#ffffff";
    Run(creep: Creep): void {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: this.PathColor } });
            }
        }
    }
}
