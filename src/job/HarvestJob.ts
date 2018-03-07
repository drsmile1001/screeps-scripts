import { IJobRunner } from "job/IJobRunner";

/**採集工作 */
export class HarvestJob implements IJobRunner {
    Job: string = "harvest";
    SayWord: string = "⛏️";
    PathColor: string = "#ffaa00";
    Run(creep: Creep): void {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: this.PathColor } });
        }
    }
}

