import { Job, JobRunResult } from "job/JobRunner";
import { JobTransition } from "job/JobTransition";
import { JobTransitionTable } from "job/JobTransitionTable";
import { Role, RoleRunner } from "roleRuner/roleRunner";

/**
 * 建築角色執行器
 */
export class Builder extends RoleRunner {
    JobTransitionTable: JobTransitionTable = new JobTransitionTable([
        new JobTransition(Job.Harvest, JobRunResult.CarryEnergyFull, Job.Build),
        new JobTransition(Job.Build, JobRunResult.OutOfEnergy, Job.Harvest)
    ]);
    DefaultJob: Job = Job.Harvest;
    Role = Role.Builder;
}
