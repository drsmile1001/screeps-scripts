import { Job, JobRunResult } from "job/JobRunner";
import { JobTransition } from "job/JobTransition";
import { JobTransitionTable } from "job/JobTransitionTable";
import { Role, RoleRunner } from "roleRuner/roleRunner";

/**
 * 採集角色執行器
 */
export class Harvester extends RoleRunner {
    JobTransitionTable: JobTransitionTable = new JobTransitionTable([
        new JobTransition(Job.Harvest, JobRunResult.CarryEnergyFull, Job.StoreEnergy),
        new JobTransition(Job.StoreEnergy, JobRunResult.OutOfEnergy, Job.Harvest)
    ]);
    DefaultJob: Job = Job.Harvest;
    Role = Role.Harvester;
}
