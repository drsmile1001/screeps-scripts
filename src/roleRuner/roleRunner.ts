import { allJobRunners } from "job/AllJobRunners";
import { Job, JobRunResult } from "job/JobRunner";
import { JobTransitionTable } from "job/JobTransitionTable";

export enum Role {
    Builder = "builder",
    Harvester = "harvester",
    Upgrader = "upgrader"
}

/**
 * 角色執行器
 */
export abstract class RoleRunner {
    /**
     * 執行器的角色
     */
    abstract Role: Role;
    /**
     * 工作轉譯表
     */
    abstract JobTransitionTable: JobTransitionTable;

    abstract DefaultJob: Job;
    /**
     *  命令creep
     */
    Run(creep: Creep): void {
        if (creep.spawning)
            return;
        // TODO: 改用warpper?
        const job = (creep.memory.job || this.DefaultJob) as Job;
        const jobRunner = allJobRunners[job];
        const runResult = jobRunner.Run(creep);
        const nextJob = this.JobTransitionTable.GetNextJob(job, runResult);
        if (!nextJob) {
            console.log(`creep ${creep.id} 職業:${this.Role} 進行工作:${job} 工作結果${runResult} 查無適合的下個工作，將繼續進行${job}`);
            return;
        }
        creep.memory.job = nextJob;
        if (runResult !== JobRunResult.OK) {
            this.Run(creep);
        }
    }
}
