import { Job, JobRunResult } from "job/JobRunner";
import { JobTransition } from "job/JobTransition";
import { JobTransitionTable } from "job/JobTransitionTable";
import { Role, RoleRunner } from "roleRuner/roleRunner";

/**
 * 升級角色執行器
 */
export class Upgrader extends RoleRunner {
    JobTransitionTable: JobTransitionTable = new JobTransitionTable([
        new JobTransition(Job.Harvest, JobRunResult.CarryEnergyFull, Job.Upgrad),
        new JobTransition(Job.Upgrad, JobRunResult.OutOfEnergy, Job.Harvest)
    ]);
    DefaultJob: Job = Job.Harvest;
    Role = Role.Upgrader;
}
