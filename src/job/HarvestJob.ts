import { Job, JobRunner, JobRunResult } from "job/JobRunner";
import { tool } from "tool";

/**
 * 採集工作執行器
 */
class HarvestJob implements JobRunner {
    Job = Job.Harvest;
    SayWord = "⛏️";
    PathColor = "#ffaa00";
    Run(creep: Creep): JobRunResult {
        if (creep.carry.energy === creep.carryCapacity)
            return JobRunResult.CarryEnergyFull;
        const target = this.FindSource(creep);
        if (!target)
            return JobRunResult.NoSuitableTarget;
        if (creep.harvest(target) === ERR_NOT_IN_RANGE)
            creep.moveTo(target, { visualizePathStyle: { stroke: this.PathColor } });
        return JobRunResult.OK;
    }
    FindSource(creep: Creep): Source | null {
        const sources = tool.FindSource(creep.room);
        if (sources.length === 0)
            return null;
        const pathLengthAndSource = sources.map((source) => {
            return {
                PathLength: creep.pos.findPathTo(source).length,
                Source: source
            };
        }).sort((x) => x.PathLength);
        return pathLengthAndSource[0].Source;
    }
}

/**
 * 採集工作執行器實例
 */
export const harvestJob = new HarvestJob();
