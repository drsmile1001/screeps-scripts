import { Job, JobRunner, JobRunResult } from "job/JobRunner";

/**
 * 建造工作執行器
 */
class BuildJob implements JobRunner {
    /**
     * 找到適合的建造地點
     * TODO: 工作目標暫存
     * @param creep
     */
    FindConstructionSites(creep: Creep): ConstructionSite<BuildableStructureConstant> | null {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        return targets.length ? targets[0] : null;
    }
    Run(creep: Creep): JobRunResult {
        if (creep.carry.energy === 0)
            return JobRunResult.OutOfEnergy;
        const target = this.FindConstructionSites(creep);
        if (!target)
            return JobRunResult.NoSuitableTarget;
        if (creep.build(target) === ERR_NOT_IN_RANGE)
            creep.moveTo(target, { visualizePathStyle: { stroke: this.PathColor } });
        return JobRunResult.OK;
    }
    Job = Job.Build;
    SayWord = "🚧";
    PathColor = "#ffffff";
}

/**
 * 建造工作執行器實例
 */
export const buildJob = new BuildJob();
