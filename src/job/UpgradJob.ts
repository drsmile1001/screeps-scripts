import { Job, JobRunner, JobRunResult } from "./JobRunner";

/**
 * 升級工作執行器
 */
class UpgradJob implements JobRunner {
    Job = Job.Upgrad;
    PathColor: string = "#ffffff";
    Run(creep: Creep): JobRunResult {
        if (creep.room.controller && creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE)
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: this.PathColor}});
        return JobRunResult.OK;
    }
}

/**
 * 升級工作執行器實例
 */
export const upgradJob = new UpgradJob();
